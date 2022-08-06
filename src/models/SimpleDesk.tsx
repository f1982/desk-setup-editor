import GUI from 'lil-gui';
import * as THREE from 'three'

class SimpleDesk extends THREE.Group {

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


  public set deskWidth(v: number) {
    this.desktopWidth = v;
    this.layout();
  }

  public set deskHeight(v: number) {
    this.desktopWidth = v;
    this.layout();
  }

  public set legsWidth(v: number) {
    this.legWidth = v;
    this.layout();
  }

  public setGUI(gui: GUI) {
    const folder = gui.addFolder('Desk');
    const params = {
      deskWidth: 2,
      deskDepth: 0.6,
      deskHeight: 0.05,
      legsHeight: 0.1,
      legsWidth: 0.05
    }
    folder.add(params, 'deskWidth', 1, 2.9).onChange((value: number) => {
      this.desktopWidth = value;
      this.layout();
    })
    folder.add(params, 'deskDepth', 0.5, 1.6).onChange((value: number) => {
      this.desktopDepth = value;
      this.layout();
    })
    folder.add(params, 'deskHeight', 0.02, 0.1).onChange((value: number) => {
      this.desktopHeight = value;
      this.layout();
    })
    folder.add(params, 'legsHeight', 0.5, 1.25).onChange((value: number) => {
      this.legHeight = value;
      this.layout();
    })
    folder.add(params, 'legsWidth', 0.02, 0.12).onChange((value: number) => {
      this.legWidth = value;
      this.layout();
    })
  }

  constructor() {
    super();

    this.init();
    this.layout();

  }

  init() {
    this.initDesktop();
    this.initLegs();
  }

  initDesktop() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: this.boardColor });
    this.desktop = new THREE.Mesh(geo, material);
    // desktop.scale.set(width, depth, height);
    this.desktop.rotation.set(Math.PI / 2, 0, 0)
    this.desktop.position.set(0, this.legHeight + this.desktopHeight / 2, 0)
    this.add(this.desktop);
  }

  initLegs() {
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({ color: this.legsColor });
      const leg = new THREE.Mesh(geo, material);

      leg.rotation.set(Math.PI / 2, 0, 0)
      this.add(leg);
      this.legs.push(leg);
    }
  }

  layout() {
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
  }
}

export default SimpleDesk;