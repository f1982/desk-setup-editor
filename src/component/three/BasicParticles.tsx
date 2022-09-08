import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, TextureLoader } from "three";
import ThreeSceneBase from "./ThreeSceneBase";

class BasicParticle extends ThreeSceneBase {

  private _particles: Points;
  private _material: PointsMaterial;

  private _count =800;

  initObjects(){

    const vertices = [];

    for (let i = 0; i < this._count; i++) {

      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push(x, y, z);

    }

    const sprite = new TextureLoader().load('/static/textures/disc.png');

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));

    const material = new PointsMaterial({ size: 35, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
    material.color.setHSL(1.0, 0.3, 0.7);
    this._material =  material;

    this._particles = new Points(geometry, material);
    this._scene.add(this._particles);
  }

  render () {
    const time = Date.now() * 0.00005;
    const h = (360 * (1.0 + time) % 360) / 360;

    this._material.color.setHSL(h, 0.5, 0.5);

    const positions = this._particles.geometry.attributes.position.array as number[];
    // const scales = this._particles.geometry.attributes.scale.array as number[];

    for (let i = 0; i < positions.length; i++) {
      // console.log(positions[i])
      positions[i] += h;
      // scales[i] = h;
    }

    this._particles.geometry.attributes.position.needsUpdate = true;
    // this._particles.geometry.attributes.scale.needsUpdate = true;
  }
}

export default BasicParticle