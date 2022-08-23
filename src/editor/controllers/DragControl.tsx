import { Camera, EventDispatcher, Group, Renderer, Scene, Vector3 } from 'three';

import { DragControls } from "three-stdlib";
import DSEObject from '../../models/DSEObject';

class DragControl extends EventDispatcher {

  scene?: Scene;
  camera?: Camera;
  renderer?: Renderer;


  dragControl?: DragControls;
  _dragGroup: Group = new Group();
  _selectedConstrain: { min: Vector3, max: Vector3 }
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
    this.scene!.add(this._dragGroup);

    const controls = new DragControls([], this.camera!, this.renderer!.domElement);
    controls.transformGroup = true;

    // add event listener to highlight dragged objects
    controls.addEventListener('dragstart', (event) => {
      this.dispatchEvent({ type: 'dragcontrolstart' });
    });

    controls.addEventListener('drag', (event) => {
      this.dragMoved = true;
      // if (this.selectedObj) {
      //   const { min, max } = this.selectedObj.getRestrictArea()
      //   // this.selectedObj.position.clamp(min, max);
      //   this.selectedObj.position.clamp(max, min);
      //   this.selectedObj.updateChildrenRestrictArea();

      //   this.dispatchEvent({ type: 'dragcontrolmoving', object: this.selectedObj })
      // }


      this._dragGroup.position.clamp(this._selectedConstrain.max, this._selectedConstrain.min)
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
    const dragObjects = this.dragControl!.getObjects();
    dragObjects.length = 0;

    // you can not move display room
    if (item?.name === 'displayRoom') {
      return;
    }

    if (this.selectedObj) {
      // put previous selected object back to the scene
      console.log('this._dragGroup.children', this._dragGroup.children);
      if (this._dragGroup.children.includes(this.selectedObj)) {
        // if the previous obj has kids
        if (this.selectedObj.kids.length > 0) {
          this.selectedObj.kids.forEach(kid => {
            this.scene?.attach(kid)
          })
        }
        this.scene?.attach(this.selectedObj)
      }
      this.selectedObj = undefined;
    }


    this.selectedObj = item;
    // put current select object and its kids all in a dragging group
    // TODO: pass the selected object constraint area to the dragging group, clamp the movement of this group
    this._dragGroup.attach(this.selectedObj);
    if (this.selectedObj.kids.length > 0) {
      this.selectedObj.kids.forEach(kid => {
        this._dragGroup.attach(kid);
      })
    }
    this._selectedConstrain = this.selectedObj.getRestrictArea();
    this.dragControl!.transformGroup = true;
    dragObjects.push(this._dragGroup);

    // console.log('dragObjects', dragObjects);

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