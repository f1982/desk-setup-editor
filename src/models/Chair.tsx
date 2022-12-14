import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import DSEObject from './DSEObject';

class Chair extends DSEObject {
  body: Mesh;

  mugWidth = 0.4
  chairHeight = 0.6;

  constructor() {
    super();

    this.name = 'chair'


    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new Mesh(geo, material);
    mesh.scale.set(this.mugWidth, this.chairHeight, this.mugWidth);
    mesh.position.set(0, this.chairHeight/2, 0);
    this.add(mesh);

    this.loadGLTF('chair.gltf');
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    return {
      max: new Vector3(
        this.restrictMin.x + this.mugWidth / 2,
        0,
        this.restrictMin.z + this.mugWidth / 2,
      ),
      min: new Vector3(
        this.restrictMax.x - this.mugWidth / 2,
        0,
        this.restrictMax.z - this.mugWidth / 2,
      )
    }
  }
}

export default Chair;