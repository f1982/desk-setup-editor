import GUI from 'lil-gui';
import * as THREE from 'three';
import { Box3, Box3Helper, BoxHelper, Color, Group, Mesh, Vector3 } from 'three';
import { getObjectSize } from '../utils/threeUtils';
import DSEObject from './DSEObject';

class SimpleDesk extends DSEObject {

  private desktopWidth = 2;
  private desktopDepth = 1.6;
  private desktopHeight = 0.05

  private legWidth = 0.05;
  private legHeight = 0.9;
  private padding = 0.1;

  private boardColor = 0xC26910;
  private legsColor = 0x000000;

  private topContainer: Group
  private desktop: Mesh;
  private legs: Mesh[] = [];

  private _slotTop: Mesh;
  private _boxHelper: Box3Helper;

  constructor() {
    super();
    this.name = "desk"

    this.initDesktop();
    this.initSlotPlane();
    this.initLegs();

    this.desktopDepth = 3;
    this.layout();

    setTimeout(() => {
      this.desktopDepth = 2;
      this.layout();
    }, 0);
  }

  public setGUI(gui: GUI) {
    const folder = gui.addFolder('Desk');
    folder.add(this, 'desktopWidth', 1, 3.6, 0.1).onChange((value: number) => {
      this.desktopWidth = value;
      this.layout();
    })
    folder.add(this, 'desktopDepth', 0.5, 2, 0.01).onChange((value: number) => {
      this.desktopDepth = value;
      this.layout();
    })
    folder.add(this, 'desktopHeight', 0.02, 0.1, 0.01).onChange((value: number) => {
      this.desktopHeight = value;
      this.layout();
    })
    folder.add(this, 'legHeight', 0.5, 1.6, 0.1).onChange((value: number) => {
      this.legHeight = value;
      this.layout();
    })
    folder.add(this, 'legWidth', 0.02, 0.12, 0.01).onChange((value: number) => {
      this.legWidth = value;
      this.layout();
    })
    folder.add(this, 'padding', 0.01, 0.2, 0.01).onChange((value: number) => {
      this.padding = value;
      this.layout();
    })
    this._guiFolder = folder;
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    return {
      max: new Vector3(
        this.restrictMin.x + this.desktopWidth / 2,
        0,
        this.restrictMin.z + this.desktopDepth / 2,
      ),
      min: new Vector3(
        this.restrictMax.x - this.desktopWidth / 2,
        0,
        this.restrictMax.z - this.desktopDepth / 2,
      )
    }
  }

  /**
   * Get the surface can be used for content object
   * The moving area
   * 
   * @returns {min, max}
   */
  public getContainerBox() {
    // const slotSize = getObjectSize(this._slotTop);
    // var boundingBox = new THREE.Box3();
    // boundingBox.copy(this._slotTop.geometry.boundingBox!);
    // this._slotTop.updateMatrixWorld(true); // ensure world matrix is up to date
    // boundingBox.applyMatrix4(this._slotTop.matrixWorld);

    // let shift = new Vector3();
    // boundingBox.getCenter(shift);
    // console.log('shift', shift);
    // // console.log(boundingBox);
    // boundingBox.translate(shift);
    
    return this.getBox(this._slotTop);

  }

  /**
   * TODO: Get configuration object can be used for saving 
   * 
   * @returns desk object data
   */
  public getConfiguration() {
    return {

    }
  }

  private initDesktop() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: this.boardColor });
    this.desktop = new THREE.Mesh(geo, material);
    this.add(this.desktop);
  }

  private initSlotPlane() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    this.add(plane);
    this._slotTop = plane;

    const helper = new THREE.Box3Helper(new THREE.Box3().setFromObject(this._slotTop), new Color(0xff0000));
    // this.add(helper);
    this._boxHelper = helper;
    this.add(helper);
  }

  private initLegs() {
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({ color: this.legsColor });
      const leg = new THREE.Mesh(geo, material);

      leg.rotation.set(Math.PI / 2, 0, 0)
      this.add(leg);
      this.legs.push(leg);
    }
  }

  /**
   * TODO: get the bounding box by using Box3 center and size
   * @param mesh 
   */
  getBox(mesh: Mesh):Box3 {
    const bbox = new THREE.Box3();

    // // using set from object
    bbox.setFromObject(mesh);
    // //add shift factor

    
    // let shift = new Vector3();
    // bbox.getCenter(shift);
    bbox.translate(new Vector3(-this.position.x, 0, -this.position.z));
    // console.log('this.position', this.position);
    return bbox;
  }

  protected layout() {
    this.desktop.rotation.set(Math.PI / 2, 0, 0)
    // this.desktop.position.set(0, this.legHeight + this.desktopHeight / 2, 0)

    // resize the desk board
    this.desktop.scale.set(this.desktopWidth, this.desktopDepth, this.desktopHeight);
    // set position of the desk board
    this.desktop.position.set(0, this.legHeight + this.desktopHeight / 2, 0);

    // this._slotTop.rotation.copy(this.desktop.rotation);
    // this._slotTop.scale.copy(this.desktop.scale);
    // this._slotTop.position.set(0, this.legHeight + this.desktopHeight, 0);

    this._slotTop.rotation.set(Math.PI / 2, 0, 0);
    this._slotTop.scale.set(this.desktopWidth, this.desktopDepth, this.desktopHeight);
    this._slotTop.position.set(0, this.legHeight + this.desktopHeight, 0);

    // resize the legs
    this.legs.forEach((leg: THREE.Mesh) => {
      leg.scale.set(this.legWidth, this.legWidth, this.legHeight);
    });

    // set positions of the legs
    this.legs[0].position.set(
      -this.desktopWidth / 2 + this.padding + this.legWidth / 2,
      this.legHeight / 2,
      -this.desktopDepth / 2 + this.padding + this.legWidth / 2
    );
    this.legs[1].position.set(
      this.desktopWidth / 2 - this.padding - this.legWidth / 2,
      this.legHeight / 2,
      -this.desktopDepth / 2 + this.padding + this.legWidth / 2
    );
    this.legs[2].position.set(
      -this.desktopWidth / 2 + this.padding + this.legWidth / 2,
      this.legHeight / 2,
      this.desktopDepth / 2 - this.padding - this.legWidth / 2
    );
    this.legs[3].position.set(
      this.desktopWidth / 2 - this.padding - this.legWidth / 2,
      this.legHeight / 2,
      this.desktopDepth / 2 - this.padding - this.legWidth / 2
    );

    // this._slotTop.updateMatrix();
    // this._slotTop.updateWorldMatrix(true, true);

    // this._slotTop.applyMatrix4(this._slotTop.matrix);
    // this.updateMatrix()
    // this.updateMatrixWorld(true);

   
    this._boxHelper.box = this.getBox(this._slotTop);

    this.updateChildrenRestrictArea();
  }
}

export default SimpleDesk;