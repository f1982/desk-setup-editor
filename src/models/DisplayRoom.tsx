import GUI from 'lil-gui';
import * as THREE from 'three';
import DSEObject from './DSEObject';

class DisplayRoom extends DSEObject {

  private _groundWidth = 5;
  private _groundHeight = 2;
  private _wallHeight = 2;
  private _showWalls = 1;

  private _groundColor = 0xcccccc;
  private _wallColor = 0xffcc66;

  private _ground: THREE.Mesh;
  private _walls: THREE.Mesh[] = [];

  constructor() {
    super();

    this.name = 'displayRoom';

    this.initGround();
    this.initWall();

    this.layout();
  }

  public setGUI(gui: GUI) {
    const folder = gui.addFolder('DisplayRoom');
    folder.add(this, '_groundWidth', 2, 10, 0.1).onChange((value: number) => {
      this._groundWidth = value;
      this.layout();
    })
    folder.add(this, '_groundHeight', 2, 10, 0.1).onChange((value: number) => {
      this._groundHeight = value;
      this.layout();
    })
    folder.add(this, '_wallHeight', 2, 3, 0.1).onChange((value: number) => {
      this._wallHeight = value;
      this.layout();
    })
    folder.add(this, '_showWalls', 0, 3, 1).onChange((value: number) => {
      this._showWalls = value;
      this.layout();
    });
    this._guiFolder = folder;
  }

  public getContainerBox() {
    return this.getBox(this._ground);
  }

  private initGround() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshLambertMaterial({ color: this._groundColor });
    material.side = THREE.DoubleSide;
    this._ground = new THREE.Mesh(geometry, material);
    this.add(this._ground);
  }

  private initWall() {
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshLambertMaterial({
        color: this._wallColor,
      });
      material.side = THREE.DoubleSide;
      const wall = new THREE.Mesh(geometry, material);
      this.add(wall);
      this._walls.push(wall);
    }
  }

  protected layout() {
    this._ground.rotation.set(Math.PI / 2, 0, 0);
    this._ground.scale.set(this._groundWidth, this._groundHeight, 0.5);

    this._walls.forEach((wall: THREE.Mesh) => {
      wall.visible = false;
    });

    //back wall
    if (this._showWalls > 0) {
      this._walls[0].visible = true;
      this._walls[0].scale.set(this._groundWidth, this._wallHeight, 0.1);
      this._walls[0].position.set(0, this._wallHeight / 2, this._groundHeight / 2);
    }

    if (this._showWalls > 1) {
      //right wall
      this._walls[1].visible = true;
      this._walls[1].scale.set(this._groundHeight, this._wallHeight, 0.1);
      this._walls[1].rotation.set(0, Math.PI / 2, 0);
      this._walls[1].position.set(this._groundWidth / 2, this._wallHeight / 2, 0);

      //left wall
      this._walls[2].visible = true;
      this._walls[2].scale.set(this._groundHeight, this._wallHeight, 0.1);
      this._walls[2].rotation.set(0, -Math.PI / 2, 0);
      this._walls[2].position.set(-this._groundWidth / 2, this._wallHeight / 2, 0);
    }

    this.updateChildrenRestrictArea();
  }
}

export default DisplayRoom;