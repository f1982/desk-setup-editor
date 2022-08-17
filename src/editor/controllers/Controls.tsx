import { Camera, Euler, Quaternion, Renderer, Scene, Vector3 } from "three";
import { OrbitControls } from "three-stdlib";
import DSEObject from "../../models/DSEObject";
import DragControl from "./DragControl";
import KeyboardController, { DSEKeyboardEvents } from "./KeyboardControl";
import RayCasterControl, { SelectObjectEvent } from "./RayCasterControl";
import TransformControl from "./TransformControl";
import gsap from 'gsap'

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
      this.moveCameraToObject(this.camera, desk, new Vector3(0, 3, -1))
    });

    this.keyboardController.addEventListener(DSEKeyboardEvents.OVERVIEW_MODE_EVENT, () => {
      const displayRoom = getDSEObject(this.scene, 'displayRoom');
      if (displayRoom) {
        this.moveCameraToObject(this.camera, displayRoom)
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

  moveCameraToObject(
    camera: THREE.Camera,
    target: THREE.Object3D,
    offset: Vector3 = new Vector3(0, 5, -5)
  ) {
    const targetPosition = new Vector3();
    target.getWorldPosition(targetPosition);

    // camera end position
    const endPosition = targetPosition.add(offset);

    //stop orbit control
    this.orbit!.enabled = false;

    gsap.to(camera.position, {
      duration: 1,
      x: endPosition.x,
      y: endPosition.y,
      z: endPosition.z,
      onUpdate: () => {
        camera.lookAt(target.getWorldPosition(targetPosition));
      },
      onComplete: () => {
        console.log('move end');
        // camera.lookAt(target.getWorldPosition(targetPosition));
        // resume orbit control
        this.orbit!.enabled = true;
      }
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

