import { Camera, Group, Mesh, MeshLambertMaterial, Object3D, Raycaster, Renderer, Scene, Vector2, Vector3 } from "three";
import { DragControls, OrbitControls, TransformControls } from "three-stdlib";
import DSEObject from "../models/DSEObject";
import KeyboardController, { DSEKeyboardEvents } from "./controllers/KeyboardController";
import RayCasterControl, { SelectObjectEvent } from "./controllers/RayCasterControl";

export const addControl = (camera: THREE.Camera, domElement: HTMLElement) => {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  return controls;
}

export const addDragAndDrop = (
  camera: THREE.Camera,
  domElement: HTMLElement,
  objects: THREE.Group[]
) => {
  // @ts-ignore
  const controls = new DragControls(objects, camera, domElement);
  controls.transformGroup = true;

  // add event listener to highlight dragged objects
  controls.addEventListener('dragstart', (event) => {
    // event.object.material.emissive.set(0xaaaaaa);
  });

  controls.addEventListener('drag', (event) => {
    // This will prevent moving z axis, but will be on 0 line.
    // change this to your object position of z axis.
    // const p = event.object.position;
    // event.object.position.set(p.x, p.y, 0);
  });

  controls.addEventListener('dragend', (event) => {
    // event.object.material.emissive.set(0x000000);
  });
}

function moveCameraToObject(camera: THREE.Camera, object: THREE.Object3D, offset: Vector3 = new Vector3(0, 5, -5)) {
  const cameraOffset = offset; // NOTE Constant offset between the camera and the target

  // NOTE Assuming the camera is direct child of the Scene
  const objectPosition = new Vector3();
  object.getWorldPosition(objectPosition);

  camera.position.copy(objectPosition).add(cameraOffset);

  camera.lookAt(objectPosition);
  // const rotationOffset = new Vector3(Math.PI/4,0,0);
  const cr = camera.rotation;
  console.log('cr', cr);
  camera.rotation.set(cr.x - 0.3, cr.y, cr.z);
}

function getDSEObjects(scene: THREE.Scene) {
  const objs = scene.children.filter((item: THREE.Object3D) => {
    return item instanceof DSEObject && item.name !== 'displayRoom'
  });
  return objs;
}

function getDSEObject(scene: THREE.Scene, name: string) {
  return scene.children.find((item: THREE.Object3D) => item instanceof DSEObject && item.name === name);
}

class GlobalController {

  camera;
  renderer;
  scene;

  orbit: OrbitControls;
  control: TransformControls;

  dragControl: DragControls;
  dragGroup: THREE.Group = new Group();
  dragMoved = false;

  keyboardController?: KeyboardController;

  rayControl?: RayCasterControl;

  selectedObj: DSEObject | null = null;

  movableObject: DSEObject;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.initRayCaster();

    this.initOrbit();
    // this.initTransformControls();

    this.initKeyboard();

    this.initDragDrop();
    //test to drag the desk
    // this.updateDragObject(getDSEObjects(this.scene)[1] as DSEObject);


  };

  initOrbit() {
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    orbit.enablePan = false;
    orbit.enableDamping = true;
    orbit.update();

    orbit.addEventListener('change', this.render);
    this.orbit = orbit;
  }

  initTransformControls() {
    const control = new TransformControls(this.camera, this.renderer.domElement);
    control.setMode('translate');

    control.addEventListener('change', (event) => {
      if (this.selectedObj) {
        const { min, max } = this.selectedObj.getRestrictArea()
        this.selectedObj.position.clamp(min, max);
        this.render(event);
      }
    });

    control.addEventListener('dragging-changed', (event) => {
      this.orbit.enabled = !event.value;
    });

    // this will affect save STL, when trying to save STL, you need to remove this controller from scene
    this.scene.add(control);
    this.control = control;
  }

  initKeyboard() {
    console.log('initKeyboard');
    this.keyboardController = new KeyboardController({
      scene: this.scene,
      camera: this.camera
    });

    this.keyboardController.addEventListener(
      DSEKeyboardEvents.OBJECT_MODE_EVENT,
      (event) => {
        console.log('OVERVIEW_MODE_EVENT', event)
        const desk = getDSEObjects(this.scene)[0];
        moveCameraToObject(this.camera, desk, new Vector3(0, 2, -1))
      })

    this.keyboardController.addEventListener(
      DSEKeyboardEvents.OVERVIEW_MODE_EVENT,
      () => {
        console.log('OVERVIEW_MODE_EVENT')
        const displayRoom = getDSEObject(this.scene, 'displayRoom');
        console.log('displayRoom', displayRoom);
        if (displayRoom) {
          moveCameraToObject(this.camera, displayRoom)
        }
      })
  }


  initRayCaster() {
    this.rayControl = new RayCasterControl({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    });
    this.rayControl.addEventListener(SelectObjectEvent, (event) => {
      console.log('SelectObjectEvent event', event);
      this.updateDragObject(event.selected);
    });
  }

  initDragDrop() {
    this.scene.add(this.dragGroup);

    const controls = new DragControls([], this.camera, this.renderer.domElement);
    controls.transformGroup = true;

    // add event listener to highlight dragged objects
    controls.addEventListener('dragstart', (event) => {
      this.orbit.enabled = false;
      // event.object.material.emissive.set(0xaaaaaa);
    });

    controls.addEventListener('drag', (event) => {
      this.dragMoved = true;
      // const obj: THREE.Object3D = event.object;
      if (this.selectedObj) {
        // get the restrict area can be moved in
        const { min, max } = this.selectedObj.getRestrictArea()
        this.selectedObj.position.clamp(min, max);
      }

    });

    controls.addEventListener('dragend', (event) => {
      console.log('dragend');
      this.orbit.enabled = true;
      // event.object.material.emissive.set(0x000000);

      // check it's click action or not
      if (!this.dragMoved) {
        if (this.selectedObj) {
          this.dragClick(this.selectedObj);
        }
      }
      this.dragMoved = false;
    });

    this.dragControl = controls
  }

  dragClick(item: DSEObject) {
    console.log('dragClick', item);

  }

  updateDragObject(item: DSEObject | null) {
    this.selectedObj = item;
    const dragObjects = this.dragControl.getObjects();
    dragObjects.length = 0
    if (this.selectedObj) {
      dragObjects.push(this.selectedObj);
    }
  }

  render(event: any) {
    // console.log('event', event);
  }

  dispose() {
    if (this.keyboardController) {
      this.keyboardController.dispose();
      this.keyboardController = undefined;
    }

    if(this.rayControl){
      this.rayControl.dispose();
      this.rayControl = undefined;
    }

  }
}

export default GlobalController;

