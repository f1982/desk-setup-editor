import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import DSEObject from './DSEObject';

class Mug extends DSEObject {

  body: Mesh;

  mugWidth: number = 0.2

  constructor() {
    super();

    this.initMug()
    this.layout();

    // this.addBoxHelper();

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
        this.restrictMin.y,
        this.restrictMin.z + this.mugWidth / 2,
      ),
      min: new Vector3(
        this.restrictMax.x - this.mugWidth / 2,
        this.restrictMax.y,
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

  protected layout() {
    this.body.scale.set(this.mugWidth, this.mugWidth, this.mugWidth)
    this.body.position.set(0, this.mugWidth/2, 0)
  }
}

export default Mug;