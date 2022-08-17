import { Camera, EventDispatcher, Renderer, Scene } from 'three';
import { TransformControls } from "three-stdlib";
import DSEObject from '../../models/DSEObject';

class TransformControl extends EventDispatcher {

  scene?: Scene;
  camera?: Camera;
  renderer?: Renderer;

  control?: TransformControls;

  selectedObj?: DSEObject;

  constructor({
    scene, camera, renderer
  }: {
    scene: Scene,
    camera: Camera,
    renderer: Renderer
  }) {
    super();

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.init();
  }

  init() {
    const control = new TransformControls(this.camera!, this.renderer!.domElement);
    control.setMode('translate');

    control.addEventListener('change', (event) => {
      if (this.selectedObj) {
        const { min, max } = this.selectedObj.getRestrictArea()
        this.selectedObj.position.clamp(min, max);
      }
    });

    control.addEventListener('dragging-changed', (event) => {
      // this.orbit.enabled = !event.value;
      this.dispatchEvent({ type: 'transformcontroldragging', value: event.value })
    });

    // this will affect save STL, when trying to save STL, you need to remove this controller from scene
    this.scene!.add(control);
    this.control = control;
  }

  render() {

  }

  public setTransformObject(item: DSEObject) {
    this.selectedObj = item;
  }

  public dispose() {
    if (this.control) {
      // this.control.removeEventListener('change', this.render.bind(this));
      this.control.dispose();
      this.control = undefined;
    }
    //TODO: remove listeners
    this.camera = undefined;
    this.renderer = undefined;
  }
}

export default TransformControl;