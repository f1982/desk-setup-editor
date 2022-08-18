import { Camera, EventDispatcher, Renderer, Scene, Vector3 } from "three";
import { OrbitControls } from "three-stdlib";
import DSEObject from "../../models/DSEObject";
import { getDSEObject, getDSEObjects, moveCameraToObject } from "../../utils/threeUtils";
import DragControl from "./DragControl";
import KeyboardController, { DSEKeyboardEvents } from "./KeyboardControl";
import RayCasterControl, { SelectObjectEvent } from "./RayCasterControl";
import TransformControl from "./TransformControl";

class GlobalController extends EventDispatcher {

  camera;
  renderer;
  scene;

  orbit?: OrbitControls;

  keyboardController?: KeyboardController;
  rayControl?: RayCasterControl;
  dragControl?: DragControl;
  transformControl?: TransformControl;

  selected: DSEObject;

  constructor(scene: Scene, camera: Camera, renderer: Renderer) {
    super();

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

    // TODO: remove listeners
    this.keyboardController.addEventListener(DSEKeyboardEvents.OBJECT_MODE_EVENT, (event) => {
      const desk = getDSEObjects(this.scene)[0];
      moveCameraToObject(this.camera, desk, new Vector3(0, 3, -1))
    });

    this.keyboardController.addEventListener(DSEKeyboardEvents.OVERVIEW_MODE_EVENT, () => {
      const displayRoom = getDSEObject(this.scene, 'displayRoom');
      if (displayRoom) {
        moveCameraToObject(this.camera, displayRoom)
      }
    });

    // TODO: move this to keyboard controller, only set selected object to the controller
    // The speed of moving object
    const ms = 0.02;

    this.keyboardController.addEventListener(DSEKeyboardEvents.MOVE_X_INCREASE, () => {
      const { min, max } = this.selected?.getRestrictArea()
      this.selected?.position.set(this.selected.position.x - ms, this.selected.position.y, this.selected.position.z);
      this.selected?.position.clamp(min, max);
    })
    this.keyboardController.addEventListener(DSEKeyboardEvents.MOVE_X_DECREASE, () => {
      const { min, max } = this.selected?.getRestrictArea()

      this.selected?.position.set(this.selected.position.x + ms, this.selected.position.y, this.selected.position.z);
      this.selected?.position.clamp(min, max);
    })
    this.keyboardController.addEventListener(DSEKeyboardEvents.MOVE_Z_INCREASE, () => {
      const { min, max } = this.selected?.getRestrictArea()

      this.selected?.position.set(this.selected.position.x, this.selected.position.y, this.selected.position.z + ms);
      this.selected?.position.clamp(min, max);
    })
    this.keyboardController.addEventListener(DSEKeyboardEvents.MOVE_Z_DECREASE, () => {
      const { min, max } = this.selected?.getRestrictArea()

      this.selected?.position.set(this.selected.position.x, this.selected.position.y, this.selected.position.z - ms);
      this.selected?.position.clamp(min, max);
    })
  }

  initRayCaster() {
    this.rayControl = new RayCasterControl({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
    });

    // TODO: remove listeners
    this.rayControl.addEventListener(SelectObjectEvent, (evt) => {

      this.dispatchEvent({ type: 'unselect_all' })

      if (this.selected !== evt.selected) {
        this.selected = evt.selected;
        this.dispatchEvent({ type: 'objectSelected', object: this.selected })
      }

      if (!this.selected) {
        return
      }

      this.selected.select();

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

    // TODO: remove listeners
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

