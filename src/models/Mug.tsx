import GUI from 'lil-gui';
import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import DSEObject from './DSEObject';

class Mug extends DSEObject {

  body: Mesh;

  mugWidth: number = 0.05

  constructor() {
    super();

    this.initMug()
    this.layout();
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    return {
      min: new Vector3(
        this.restrictMin.x + this.mugWidth / 2,
        this.restrictMin.y + this.mugWidth / 2,
        this.restrictMin.z + this.mugWidth / 2,
      ),
      max: new Vector3(
        this.restrictMax.x - this.mugWidth / 2,
        this.restrictMax.y + this.mugWidth / 2,
        this.restrictMax.z - this.mugWidth / 2,
      )
    }
  }

  private initMug() {
    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xffcc99 });
    this.body = new Mesh(geo, material);

    this.add(this.body);
  }

  private layout() {
    this.body.scale.set(this.mugWidth, this.mugWidth, this.mugWidth)
  }
}


export default Mug;