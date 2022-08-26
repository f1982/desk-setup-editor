import GUI from 'lil-gui';
import * as THREE from 'three';
import { Box3, Box3Helper, Color, Mesh, Vector3 } from 'three';
import DSEObject from './DSEObject';

class SimpleDesk extends DSEObject {

  private _topWidth = 2;
  private _topHeight = 1.6;
  private _topThick = 0.05

  private _legWidth = 0.05;
  private _legLength = 0.9;
  private _padding = 0.1;

  private _tableTopColor = 0xC26910;
  private _legColor = 0x000000;

  private _tableTop: Mesh;
  private _legs: Mesh[] = [];

  private _slotTop: Mesh;
  private _boxHelper: Box3Helper;

  constructor() {
    super();
    this.name = "desk"
    this._debug = false;

    this.initDesktop();
    this.initLegs();
    this.initSlotPlane();

    // this.layout();
    // TODO: figure out why it needs this set timeout
    setTimeout(() => {
      this._topHeight = 2;
      this.layout();
    }, 10);
  }

  public setGUI(gui: GUI) {
    const folder = gui.addFolder('Desk');
    folder.add(this, '_topWidth', 1, 3.6, 0.1).onChange((value: number) => {
      this._topWidth = value;
      this.layout();
    })
    folder.add(this, '_topHeight', 0.5, 2, 0.01).onChange((value: number) => {
      this._topHeight = value;
      this.layout();
    })
    folder.add(this, '_topThick', 0.02, 0.1, 0.01).onChange((value: number) => {
      this._topThick = value;
      this.layout();
    })
    folder.add(this, '_legLength', 0.5, 1.6, 0.1).onChange((value: number) => {
      this._legLength = value;
      this.layout();
    })
    folder.add(this, '_legWidth', 0.02, 0.12, 0.01).onChange((value: number) => {
      this._legWidth = value;
      this.layout();
    })
    folder.add(this, '_padding', 0.01, 0.2, 0.01).onChange((value: number) => {
      this._padding = value;
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
        this.restrictMin.x + this._topWidth / 2,
        0,
        this.restrictMin.z + this._topHeight / 2,
      ),
      min: new Vector3(
        this.restrictMax.x - this._topWidth / 2,
        0,
        this.restrictMax.z - this._topHeight / 2,
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
    const material = new THREE.MeshLambertMaterial({ color: this._tableTopColor });
    this._tableTop = new THREE.Mesh(geo, material);
    this.add(this._tableTop);
  }

  private initSlotPlane() {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    this.add(plane);
    this._slotTop = plane;

    if (this._debug) {
      const helper = new THREE.Box3Helper(this.getBox(this._slotTop), new Color(0xff0000));
      this._boxHelper = helper;
      this.add(helper);
    }
  }

  private initLegs() {
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({ color: this._legColor });
      const leg = new THREE.Mesh(geo, material);

      leg.rotation.set(Math.PI / 2, 0, 0)
      this.add(leg);
      this._legs.push(leg);
    }
  }

  /**
   * Get child mesh box
   * @param mesh 
   */
  getBox(mesh: Mesh): Box3 {
    const box = new THREE.Box3();
    box.setFromObject(mesh);
    // offset with object position
    box.translate(new Vector3(-this.position.x, 0, -this.position.z));
    return box;
  }

  protected layout() {
    this._tableTop.rotation.set(Math.PI / 2, 0, 0)
    // resize the desk board
    this._tableTop.scale.set(this._topWidth, this._topHeight, this._topThick);
    // set position of the desk board
    this._tableTop.position.set(0, this._legLength + this._topThick / 2, 0);

    this._slotTop.rotation.copy(this._tableTop.rotation);
    this._slotTop.scale.copy(this._tableTop.scale);
    this._slotTop.position.set(0, this._legLength + this._topThick + 0.001, 0);

    // resize the _legs
    this._legs.forEach((leg: THREE.Mesh) => {
      leg.scale.set(this._legWidth, this._legWidth, this._legLength);
    });

    // set positions of the _legs
    this._legs[0].position.set(
      -this._topWidth / 2 + this._padding + this._legWidth / 2,
      this._legLength / 2,
      -this._topHeight / 2 + this._padding + this._legWidth / 2
    );
    this._legs[1].position.set(
      this._topWidth / 2 - this._padding - this._legWidth / 2,
      this._legLength / 2,
      -this._topHeight / 2 + this._padding + this._legWidth / 2
    );
    this._legs[2].position.set(
      -this._topWidth / 2 + this._padding + this._legWidth / 2,
      this._legLength / 2,
      this._topHeight / 2 - this._padding - this._legWidth / 2
    );
    this._legs[3].position.set(
      this._topWidth / 2 - this._padding - this._legWidth / 2,
      this._legLength / 2,
      this._topHeight / 2 - this._padding - this._legWidth / 2
    );

    // draw the slot
    if (this._debug) {
      this._boxHelper.box = this.getBox(this._slotTop);
    }

    this.updateChildrenRestrictArea();
  }
}

export default SimpleDesk;