import { Box3, Object3D, Vector3 } from 'three';
import DSEObject from './DSEObject';

class CoffeeCup extends DSEObject {

  mugWidth: number = 0.2;
  occupiedMesh?: Object3D;


  constructor() {
    super();

    this.loadGLTF('coffee-cup.gltf', () => {
      this.occupiedMesh = this.children.find(item => item.name === 'occupied');
    })
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    // return {
    //   max: new Vector3(
    //     this.restrictMin.x + this.mugWidth / 2,
    //     this.restrictMin.y,
    //     this.restrictMin.z + this.mugWidth / 2,
    //   ),
    //   min: new Vector3(
    //     this.restrictMax.x - this.mugWidth / 2,
    //     this.restrictMax.y,
    //     this.restrictMax.z - this.mugWidth / 2,
    //   )
    // }

    if (!this.occupiedMesh) {
      // throw new Error('Cannot find occupied mesh')
      return {
        max: new Vector3(),
        min: new Vector3(),
      }
    }
    const bbox = new Box3().setFromObject(this.occupiedMesh);
    let measure = new Vector3();
    bbox.getSize(measure);

    return {
      max: new Vector3(
        this.restrictMin.x + measure.x / 2,
        this.restrictMin.y,
        this.restrictMin.z + measure.z / 2,
      ),
      min: new Vector3(
        this.restrictMax.x - measure.x / 2,
        this.restrictMax.y,
        this.restrictMax.z - measure.z / 2,
      )
    }
  }
}

export default CoffeeCup;