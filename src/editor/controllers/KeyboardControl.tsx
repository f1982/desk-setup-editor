import { Camera, EventDispatcher, Scene } from 'three'

enum ShortcutKeys {
  SWITCH_OBJECT_KEY_CODE = "KeyA",
  BACK_OVERVIEW_KEY_CODE = "Escape"
}

export enum DSEKeyboardEvents {
  OBJECT_MODE_EVENT = "SwitchToObjectEvent",
  OVERVIEW_MODE_EVENT = "SwitchToOverviewEvent",
  MOVE_X_INCREASE = "MoveXIncrease",
  MOVE_X_DECREASE = "MoveXDecrease",
  MOVE_Z_INCREASE = "MoveZIncrease",
  MOVE_Z_DECREASE = "MoveZDecrease",
}

class KeyboardController extends EventDispatcher {

  scene: Scene | null;
  camera: Camera | null;

  constructor({ scene, camera }: { scene: Scene, camera: Camera }) {
    super();
    this.scene = scene;
    this.camera = camera;

    this.initKeyboard();
  }

  initKeyboard() {
    document.addEventListener('keydown', this.handleKeydown.bind(this), false);
    document.addEventListener('keyup', this.handleKeyup.bind(this), false);
  }

  handleKeydown(event: KeyboardEvent) {
    console.log('event', event);
    switch (event.code) {
      case ShortcutKeys.SWITCH_OBJECT_KEY_CODE: {
        this.dispatchEvent({ type: DSEKeyboardEvents.OBJECT_MODE_EVENT });
        break;
      }
      case ShortcutKeys.BACK_OVERVIEW_KEY_CODE: {
        this.dispatchEvent({ type: DSEKeyboardEvents.OVERVIEW_MODE_EVENT });
        break;
      }
      case "ArrowLeft": {
        this.dispatchEvent({ type: DSEKeyboardEvents.MOVE_X_DECREASE });
        break;
      }
      case "ArrowRight": {
        this.dispatchEvent({ type: DSEKeyboardEvents.MOVE_X_INCREASE });
        break;
      }
      case "ArrowUp": {
        this.dispatchEvent({ type: DSEKeyboardEvents.MOVE_Z_INCREASE });
        break;
      }
      case "ArrowDown": {
        this.dispatchEvent({ type: DSEKeyboardEvents.MOVE_Z_DECREASE });
        break;
      }

    }
  }

  handleKeyup(event: KeyboardEvent) {

  }

  public dispose() {
    this.scene = null;
    this.camera = null;

    document.removeEventListener("keydown", this.handleKeydown)
    document.removeEventListener('keyup', this.handleKeyup);
  }
}

export default KeyboardController;