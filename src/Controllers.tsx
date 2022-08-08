import { Camera, Mesh, Object3D, Raycaster, Renderer, Scene, Vector2 } from "three";
import { DragControls, OrbitControls, TransformControls } from "three-stdlib";
import DSEObject from "./models/DSEObject";
import { getMovableMeshes } from "./utils/threeUtils";

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

  camera;
  renderer;
  scene;

  orbit: OrbitControls;
  control: TransformControls;

  rayCaster: Raycaster;
  rayPointer: Vector2 = new Vector2();
  selectedObj: DSEObject | null = null;

  movableObject: DSEObject;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;

    this.initOrbit();
    this.initTransformControls();

    this.initRayCaster();
  };

  public attachObject(obj: DSEObject) {
    if (this.movableObject) {
      this.control.detach();
    }

    this.movableObject = obj;
    this.control.attach(this.movableObject);
  }

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
      const { min, max } = this.movableObject.getRestrictArea()
      this.movableObject.position.clamp(min, max);

      this.render(event);
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

      this.updateRayCasterPointer(event);

      rayCaster.setFromCamera(this.rayPointer, this.camera);
      const intersects = rayCaster.intersectObjects<Object3D>(
        getMovableMeshes(this.scene),
        true
      );

      console.log('all meshes: ', getMovableMeshes(this.scene))

      if (intersects.length > 0 && intersects[0].object.parent instanceof DSEObject) {
        console.log('intersects[0]: ',intersects[0]);
        if (this.selectedObj !== intersects[0].object.parent) {
          this.selectedObj = intersects[0].object.parent;

          this.control.detach();
          this.control.attach(this.selectedObj);

        } else {
          // this.selectedObj = null;
          this.control.detach();
        }
      } else {
        // this.control.detach();
        // this.selectedObj = null;
      }
    });

    this.rayCaster = rayCaster;
  }

  updateRayCasterPointer(event: MouseEvent) {

    const domElement = this.renderer.domElement;
    const rect = domElement.getBoundingClientRect();

    this.rayPointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    this.rayPointer.y = - (event.clientY - rect.top) / rect.height * 2 + 1;
  }

  render(event: any) {
    // console.log('event', event);
  }
}

export default GlobalController;

