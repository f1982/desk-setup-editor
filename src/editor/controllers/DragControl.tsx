import { Camera, EventDispatcher, Group, Renderer, Scene } from 'three';

import { DragControls } from "three-stdlib";
import DSEObject from '../../models/DSEObject';

class DragControl extends EventDispatcher {

  scene?: Scene;
  camera?: Camera;
  renderer?: Renderer;

  dragControl?: DragControls;
  dragGroup: THREE.Group = new Group();
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
    this.scene!.add(this.dragGroup);

    const controls = new DragControls([], this.camera!, this.renderer!.domElement);
    controls.transformGroup = true;

    // add event listener to highlight dragged objects
    controls.addEventListener('dragstart', (event) => {
      this.dispatchEvent({ type: 'dragcontrolstart' });
    });

    controls.addEventListener('drag', (event) => {
      this.dragMoved = true;
      if (this.selectedObj) {
        const { min, max } = this.selectedObj.getRestrictArea()
        // this.selectedObj.position.clamp(min, max);
        this.selectedObj.position.clamp(max, min);
        this.selectedObj.updateChildrenRestrictArea();
        
        this.dispatchEvent({ type: 'dragcontrolmoving', object: this.selectedObj })
      }
    });

    controls.addEventListener('dragend', (event) => {
      this.dispatchEvent({ type: 'dragcontrolend' });
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
    this.selectedObj = item;
    const dragObjects = this.dragControl!.getObjects();
    dragObjects.length = 0
    if (this.selectedObj) {
      dragObjects.push(this.selectedObj);
      // if (this.selectedObj.kids.length > 0) {
      //   this.dragControl!.transformGroup = true;
      //   dragObjects.push(...this.selectedObj.kids);
      // }
      console.log('dragObjects', dragObjects);
    }
  }

  public dispose() {
    if (this.dragControl) {
      this.dragControl.dispose();
      this.dragControl = undefined;
    }
    //TODO: remove listeners
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }
}

export default DragControl;