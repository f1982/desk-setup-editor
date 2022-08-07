import { Camera, Group, Renderer, Scene, Vector3 } from "three";
import { OrbitControls, DragControls, TransformControls } from "three-stdlib";
import DSEObject from "./models/DSEObject";

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


class GlobalController {

  currentCamera;
  renderer;
  scene;

  orbit: OrbitControls;
  control: TransformControls;

  attachObj: DSEObject;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.currentCamera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.init();
  };

  public attachObject(obj: DSEObject) {
    if (this.attachObj) {
      this.control.detach();
    }
    this.attachObj = obj;
    this.control.attach(this.attachObj);

    console.log(this.attachObj.getRestrictArea());
  }


  init() {
    const orbit = new OrbitControls(this.currentCamera, this.renderer.domElement);
    orbit.update();

    orbit.addEventListener('change', this.render);
    this.orbit = orbit;

    const control = new TransformControls(this.currentCamera, this.renderer.domElement);
    control.setMode('translate');
    // control.show

    control.addEventListener('change', (event) => {

      const { min, max } = this.attachObj.getRestrictArea()
      this.attachObj.position.clamp(min, max);

      this.render(event);

    });
    control.addEventListener('dragging-changed', (event) => {
      console.log('dragging-changed', event)
      this.orbit.enabled = !event.value;

    });
    this.scene.add(control);
    this.control = control;

  }

  render(event: any) {
    console.log('event', event);
    // dispatchEvent(new CustomEvent('change'));
  }
}

export default GlobalController;