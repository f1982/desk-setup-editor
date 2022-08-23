import { Camera, EventDispatcher, Scene, Vector3 } from 'three'
import DSEObject from '../../models/DSEObject';

enum ShortcutKeys {
  SWITCH_OBJECT_KEY_CODE = "KeyA",
  BACK_OVERVIEW_KEY_CODE = "Escape"
}

export enum DSEKeyboardEvents {
  OBJECT_MODE_EVENT = "SwitchToObjectEvent",
  OVERVIEW_MODE_EVENT = "SwitchToOverviewEvent",
}

class KeyboardController extends EventDispatcher {

  scene: Scene | null;
  camera: Camera | null;

  selected?: DSEObject;

  movingStep: number = 0.04; // 1 stand for 1 meter, so 0.04 means 4cm per press

  constructor({ scene, camera }: { scene: Scene, camera: Camera }) {
    super();
    this.scene = scene;
    this.camera = camera;

    this.initKeyboard();
  }

  public setSelectedObject(object: DSEObject) {
    this.selected = object;
  }

  initKeyboard() {
    document.addEventListener('keydown', this.handleKeydown.bind(this), false);
    document.addEventListener('keyup', this.handleKeyup.bind(this), false);
  }

  handleKeydown(event: KeyboardEvent) {
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
        this.moveObject(new Vector3(this.movingStep, 0, 0));
        break;
      }
      case "ArrowRight": {
        this.moveObject(new Vector3(-this.movingStep, 0, 0));
        break;
      }
      case "ArrowUp": {
        this.moveObject(new Vector3(0, 0, this.movingStep));
        break;
      }
      case "ArrowDown": {
        this.moveObject(new Vector3(0, 0, -this.movingStep));
        break;
      }
    }

    if (
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown'
    ) {
      this.dispatchEvent({ type: 'keyboardMove', object: this.selected })
    }
  }

  handleKeyup(event: KeyboardEvent) {

  }

  moveObject(step: Vector3) {
    if (this.selected) {
      const newPos = new Vector3()
      newPos.copy(this.selected.position).add(step);
      this.selected?.position.copy(newPos);

      this.selected?.clampIn();
    }
  }

  public dispose() {
    this.scene = null;
    this.camera = null;

    document.removeEventListener("keydown", this.handleKeydown)
    document.removeEventListener('keyup', this.handleKeyup);
  }
}

export default KeyboardController;