import { Box3, Vector3 } from 'three';
import DSEObject from './DSEObject';

class MonitorStand extends DSEObject {

  mugWidth: number = 0.2

  occupiedMesh: any;

  constructor() {
    super();

    this.loadGLTF('monitor-stand.gltf', () => {

    })
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {

    const bbox = new Box3().setFromObject(this);
    let measure = new Vector3();
    bbox.getSize(measure);
    // console.log('size of monitor stand: ',measure);

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

export default MonitorStand;