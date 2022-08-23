import { Camera, EventDispatcher, Renderer, Scene } from 'three';
import { DragControls } from "three-stdlib";
import DSEObject from '../../models/DSEObject';

class DragControl extends EventDispatcher {
  scene?: Scene;
  camera?: Camera;
  renderer?: Renderer;

  dragControl: DragControls;
  dragMoved = false;

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
    const controls = new DragControls([], this.camera!, this.renderer!.domElement);
    controls.transformGroup = true;

    controls.addEventListener('dragstart', (event) => {
      this.dispatchEvent({ type: 'dragcontrolstart' });
    });

    controls.addEventListener('drag', (event) => {
      this.dragMoved = true;
      if (this.selectedObj) {
        this.selectedObj.clampIn();
        this.dispatchEvent({ type: 'dragcontrolmoving', object: this.selectedObj })
      }
    });

    controls.addEventListener('dragend', (event) => {
      this.dispatchEvent({ type: 'dragcontrolend' });

      // check is click or not
      if (!this.dragMoved && this.selectedObj) {
        this.dragClick(this.selectedObj);
      }

      this.dragMoved = false;
    });

    this.dragControl = controls
  }

  dragClick(item: DSEObject) {
    this.dispatchEvent({ type: 'dragcontrolclick', object: item })
  }

  public setDragObject(item: DSEObject) {

    // clean drag objects
    const dragObjects = this.dragControl!.getObjects();
    dragObjects.length = 0;

    this.dragControl.enabled = false;

    this.selectedObj = item;

    if (this.selectedObj) {
      this.dragControl.enabled=true;
      dragObjects.push(this.selectedObj);
    }
  }

  public dispose() {
    if (this.dragControl) {
      this.dragControl.dispose();
      // this.dragControl = undefined;
    }
    //TODO: remove listeners
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }
}

export default DragControl;