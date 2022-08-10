import GUI from 'lil-gui';
import * as THREE from 'three'
import { Vector3 } from 'three';
import DSEObject from './DSEObject';

class SimpleDesk extends DSEObject {

  private desktopWidth = 2;
  private desktopDepth = 0.6;
  private desktopHeight = 0.05

  private legWidth = 0.05;
  private legHeight = 0.9;
  private padding = 0.1;

  private boardColor = 0xC26910;
  private legsColor = 0x000000;

  private desktop: THREE.Mesh;
  private legs: THREE.Mesh[] = [];

  constructor() {
    super();

    this.initDesktop();
    this.initLegs();

    this.layout();
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
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    return {
      min: new Vector3(
        this.restrictMin.x + this.desktopWidth / 2,
        0,
        this.restrictMin.z + this.desktopDepth / 2,
      ),
      max: new Vector3(
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
    const topSurface = this.legHeight + this.desktopHeight;
    return {
      min: new Vector3(
        this.position.x - this.desktopWidth / 2,
        topSurface,
        this.position.z - this.desktopDepth / 2
      ),
      max: new Vector3(
        this.position.x + this.desktopWidth / 2,
        topSurface,
        this.position.z + this.desktopDepth / 2
      )
    }
  }

  /**
   * Get configuration object can be used for saving 
   * @returns desk object data
   */
  public getConfiguration() {
    return {

    }
  }

  public addSub(child: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(child);

    // console.log('box', box);
    child.position.set(0, this.legHeight + this.desktopHeight + box.max.y, 0)
    this.add(child);
    console.log('desk children:',this.children);
  }

  private initDesktop() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: this.boardColor });
    this.desktop = new THREE.Mesh(geo, material);

    this.add(this.desktop);
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

  private layout() {
    this.desktop.rotation.set(Math.PI / 2, 0, 0)
    // this.desktop.position.set(0, this.legHeight + this.desktopHeight / 2, 0)

    // resize the desk board
    this.desktop.scale.set(this.desktopWidth, this.desktopDepth, this.desktopHeight);
    // set position of the desk board
    this.desktop.position.set(0, this.legHeight + this.desktopHeight / 2, 0);

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

    this.dispatchEvent({ type: 'layout-change', message: 'desk changed' });
  }
}

export default SimpleDesk;