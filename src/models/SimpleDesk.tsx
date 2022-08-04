import * as THREE from 'three'

class SimpleDesk extends THREE.Group {

  desktopWidth=2;
  desktopDepth=0.6;
  desktopHeight = 0.05

  legWidth = 0.05;
  legHeight = 0.8;
  padding = 0.1;

  legs = Array<THREE.Mesh>();

  constructor() {
    super();

    // this.desktopWidth = width;
    // this.desktopDepth = depth;

    this.init();
    this.layout();
  }

  init() {
    this.initDesktop(this.desktopWidth, this.desktopDepth, this.desktopHeight);
    this.initLegs();
  }

  initDesktop(width: number, depth: number, height: number,) {
    const geo = new THREE.BoxGeometry(width, depth, height);
    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const desktop = new THREE.Mesh(geo, material);
    this.add(desktop);
  }

  initLegs() {
    for (let i = 0; i < 4; i++) {
      const leg = this.getSingleLeg();
      this.add(leg);
      this.legs.push(leg);
    }
  }

  getSingleLeg () {
    const geo = new THREE.BoxGeometry(this.legWidth, this.legWidth, this.legHeight);
    const material = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    const leg = new THREE.Mesh(geo, material);
    return leg;
  }

  layout() {
    this.legs[0].position.set(
      -this.desktopWidth / 2 + this.legWidth / 2 + this.padding,
      -this.desktopDepth / 2 + this.legWidth / 2 + this.padding,
      -this.legHeight / 2
    );

    this.legs[1].position.set(
      this.desktopWidth / 2 - this.legWidth / 2 - this.padding,
      -this.desktopDepth / 2 + this.legWidth / 2 + this.padding,
      -this.legHeight / 2
    );

    this.legs[2].position.set(
      -this.desktopWidth / 2 + this.legWidth / 2 + this.padding,
      this.desktopDepth / 2 - this.legWidth / 2 - this.padding,
      -this.legHeight / 2
    );

    this.legs[3].position.set(
      this.desktopWidth / 2 - this.legWidth / 2 - this.padding,
      this.desktopDepth / 2 - this.legWidth / 2 - this.padding,
      -this.legHeight / 2
    );
  }
}

export default SimpleDesk;