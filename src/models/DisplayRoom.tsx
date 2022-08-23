import GUI from 'lil-gui';
import * as THREE from 'three'
import { Vector3 } from 'three';
import DSEObject from './DSEObject';

class DisplayRoom extends DSEObject {

  private groundWidth = 5;
  private groundHeight = 5;
  private wallHeight = 2;
  private showWalls = 3;

  private groundColor = 0xcccccc;
  private wallColor = 0xffcc66;

  private ground: THREE.Mesh;
  private walls: THREE.Mesh[] = [];

  constructor() {
    super();

    this.name = 'displayRoom';
    
    this.initGround();
    this.initWall();

    this.layout();
  }

  public setGUI(gui: GUI) {
    const folder = gui.addFolder('DisplayRoom');
    folder.add(this, 'groundWidth', 2, 10, 0.1).onChange((value: number) => {
      this.groundWidth = value;
      this.layout();
    })
    folder.add(this, 'groundHeight', 2, 10, 0.1).onChange((value: number) => {
      this.groundHeight = value;
      this.layout();
    })
    folder.add(this, 'wallHeight', 2, 3, 0.1).onChange((value: number) => {
      this.wallHeight = value;
      this.layout();
    })
    folder.add(this, 'showWalls', 0, 3, 1).onChange((value: number) => {
      this.showWalls = value;
      this.layout();
    });
    this._guiFolder = folder;
  }

  public getContainerBox() {
    return {
      min: new Vector3(
        -this.groundWidth / 2,
        0,
        -this.groundHeight / 2
      ),
      max: new Vector3(
        this.groundWidth / 2,
        0,
        this.groundHeight / 2
      )
    }
  }

  private initGround() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshLambertMaterial({ color: this.groundColor });
    material.side = THREE.DoubleSide;
    this.ground = new THREE.Mesh(geometry, material);
    this.add(this.ground);
  }

  private initWall() {
    for (let i = 0; i < this.showWalls; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshLambertMaterial({
        color: this.wallColor,
      });
      material.side = THREE.DoubleSide;
      const wall = new THREE.Mesh(geometry, material);
      this.add(wall);
      this.walls.push(wall);
    }
  }

  protected layout() {
    this.ground.rotation.set(Math.PI / 2, 0, 0);
    this.ground.scale.set(this.groundWidth, this.groundHeight, 0.5);

    this.walls.forEach((wall: THREE.Mesh) => {
      wall.visible = false;
    });

    //back wall
    if (this.showWalls > 0) {
      this.walls[0].visible = true;
      this.walls[0].scale.set(this.groundWidth, this.wallHeight, 0.1);
      this.walls[0].position.set(0, this.wallHeight / 2, this.groundHeight / 2);
    }

    if (this.showWalls > 1) {
      //right wall
      this.walls[1].visible = true;
      this.walls[1].scale.set(this.groundHeight, this.wallHeight, 0.1);
      this.walls[1].rotation.set(0, Math.PI / 2, 0);
      this.walls[1].position.set(this.groundWidth / 2, this.wallHeight / 2, 0);

      //left wall
      this.walls[2].visible = true;
      this.walls[2].scale.set(this.groundHeight, this.wallHeight, 0.1);
      this.walls[2].rotation.set(0, -Math.PI / 2, 0);
      this.walls[2].position.set(-this.groundWidth / 2, this.wallHeight / 2, 0);
    }

    // this.dispatchEvent({ type: 'layout-change', message: 'room changed' });
    this.updateChildrenRestrictArea();
  }
}

export default DisplayRoom;