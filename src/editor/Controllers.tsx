import { Camera, Group, Mesh, Object3D, Raycaster, Renderer, Scene, Vector2, Vector3 } from "three";
import { DragControls, OrbitControls, TransformControls } from "three-stdlib";
import DSEObject from "../models/DSEObject";

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


function getMovableMeshes(scene: THREE.Scene) {
  const objs = scene.children.filter((item: THREE.Object3D) => {
    return item instanceof DSEObject && item.name !== 'displayRoom'
  });
  const meshes: any[] = [];
  objs.forEach(element => {
    const elementMeshes = element.children.filter(item => (item instanceof Mesh));
    meshes.push(...elementMeshes);

    // get dse object list inside des object
    const subObjs = element.children.filter(item => (item instanceof DSEObject));
    // console.log('subObjs', subObjs);
    subObjs.forEach(subObj => {
      //meshes inside des
      const subMeshes = subObj.children.filter(subItem => (subItem instanceof Mesh));
      // console.log('subMeshes', subMeshes);
      meshes.push(...subMeshes);
    })
  });
  return meshes;
}

function getDSEObjects(scene: THREE.Scene) {
  const objs = scene.children.filter((item: THREE.Object3D) => {
    return item instanceof DSEObject && item.name !== 'displayRoom'
  });
  return objs;
}

class GlobalController {

  camera;
  renderer;
  scene;

  orbit: OrbitControls;
  control: TransformControls;
  dragControl: DragControls;

  dragGroup: THREE.Group = new Group();;

  rayCaster: Raycaster;
  rayPointer: Vector2 = new Vector2();
  selectedObj: DSEObject | null = null;

  movableObject: DSEObject;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.initRayCaster();

    this.initOrbit();
    // this.initTransformControls();

    this.initDragDrop();

    this.updateDragObject(getDSEObjects(this.scene)[1]);
  };

  // public attachObject(obj: DSEObject) {
  //   if (this.movableObject) {
  //     this.control.detach();
  //   }

  //   this.movableObject = obj;
  //   this.control.attach(this.movableObject);
  // }

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


  initRayCaster() {
    const rayCaster = new Raycaster();
    this.renderer.domElement.addEventListener('pointerdown', (event) => {

      // this.updateRayCasterPointer(event);
      // Update ray caster pointer
      const domElement = this.renderer.domElement;
      const rect = domElement.getBoundingClientRect();
      this.rayPointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      this.rayPointer.y = - (event.clientY - rect.top) / rect.height * 2 + 1;
      rayCaster.setFromCamera(this.rayPointer, this.camera);

      const selectableElements = getMovableMeshes(this.scene);
      const intersects = rayCaster.intersectObjects<Object3D>(selectableElements, true);

      if (
        intersects.length > 0 &&
        intersects[0].object.parent instanceof DSEObject
      ) {
        this.selectedObj = intersects[0].object.parent;
        // this.control.attach(this.selectedObj);
      } else {
        // this.control.detach();
        this.selectedObj = null;
      }
      console.log('this.selectedObj', this.selectedObj);
    });

    this.rayCaster = rayCaster;
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
      // This will prevent moving z axis, but will be on 0 line.
      // change this to your object position of z axis.
      // const p = event.object.position;
      const obj: THREE.Object3D = event.object;
      obj.position.clamp(new Vector3(-2, 0, -2), new Vector3(2, 0, 2))
    });

    controls.addEventListener('dragend', (event) => {
      this.orbit.enabled = true;
      // event.object.material.emissive.set(0x000000);
    });
    this.dragControl = controls
  }

  updateDragObject(item: Object3D) {
    // const objects = getDSEObjects(this.scene)[1].children;
    // const objects = getMovableMeshes(this.scene);
    // console.log('initDragDrop objects', objects);
    // for (let i = 0; i < objects.length; i++) {
    //   const element = objects[i];
    //   console.log('element', element);
    //   this.dragGroup.attach(element)
    // }
    
    while (item.children.length > 0) {
      this.dragGroup.attach(item.children[0])
    }

    const dragObjects = this.dragControl.getObjects();
    dragObjects.length = 0
    dragObjects.push(this.dragGroup);
  }

  render(event: any) {
    // console.log('event', event);
  }
}

export default GlobalController;

