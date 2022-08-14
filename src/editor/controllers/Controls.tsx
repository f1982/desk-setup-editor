import { Camera, Renderer, Scene, Vector3 } from "three";
import { OrbitControls } from "three-stdlib";
import DSEObject from "../../models/DSEObject";
import DragControl from "./DragControl";
import KeyboardController, { DSEKeyboardEvents } from "./KeyboardControl";
import RayCasterControl, { SelectObjectEvent } from "./RayCasterControl";
import TransformControl from "./TransformControl";

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

  orbit?: OrbitControls;

  keyboardController?: KeyboardController;
  rayControl?: RayCasterControl;
  dragControl?: DragControl;
  transformControl?: TransformControl;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.initRayCaster();
    this.initOrbit();
    this.initKeyboard();
    this.initDragControl();
    // this.initTransformControls();
  };

  initOrbit() {
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    orbit.enablePan = false;
    orbit.enableDamping = true;
    orbit.update();
    orbit.addEventListener('change', () => { });
    this.orbit = orbit;
  }

  initTransformControls() {
    this.transformControl = new TransformControl({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    });

    this.transformControl.addEventListener('transformcontroldragging', (evt) => {
      this.orbit!.enabled = !evt.value
    });
  }

  initKeyboard() {
    this.keyboardController = new KeyboardController({
      scene: this.scene,
      camera: this.camera
    });

    this.keyboardController.addEventListener(DSEKeyboardEvents.OBJECT_MODE_EVENT, (event) => {
      const desk = getDSEObjects(this.scene)[0];
      moveCameraToObject(this.camera, desk, new Vector3(0, 2, -1))
    });

    this.keyboardController.addEventListener(DSEKeyboardEvents.OVERVIEW_MODE_EVENT, () => {
      const displayRoom = getDSEObject(this.scene, 'displayRoom');
      if (displayRoom) {
        moveCameraToObject(this.camera, displayRoom)
      }
    });
  }

  initRayCaster() {
    this.rayControl = new RayCasterControl({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    });

    this.rayControl.addEventListener(SelectObjectEvent, (evt) => {
      // should only use one control to move object
      if (this.dragControl) {
        this.dragControl.setDragObject(evt.selected)
      }
      if (this.transformControl) {
        this.transformControl.setTransformObject(evt.selected);
      }
    });
  }

  initDragControl() {
    this.dragControl = new DragControl({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    });

    this.dragControl.addEventListener('dragcontrolstart', () => {
      this.orbit!.enabled = false;
    });

    this.dragControl.addEventListener('dragcontrolend', () => {
      this.orbit!.enabled = true;
    });

    this.dragControl.addEventListener('dragcontrolclick', (evt) => {
      console.log('click on object', evt.object);
    });
  }

  dispose() {
    if (this.orbit) {
      this.orbit.dispose();
      this.orbit = undefined;
    }

    if (this.keyboardController) {
      this.keyboardController.dispose();
      this.keyboardController = undefined;
    }

    if (this.rayControl) {
      this.rayControl.dispose();
      this.rayControl = undefined;
    }

    if (this.dragControl) {
      this.dragControl.dispose();
      this.dragControl = undefined
    }
    if (this.transformControl) {
      this.transformControl.dispose();
      this.transformControl = undefined
    }
  }
}

export default GlobalController;

