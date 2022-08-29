import { Box3, Box3Helper, Color, Mesh, Object3D, Vector3 } from 'three';
import DSEObject from './DSEObject';

class MonitorStand extends DSEObject {

  mugWidth: number = 0.2

  occupiedMesh: any;

  protected _slot?: Object3D;
  protected _occupied?: Object3D;

  private _boxHelper: Box3Helper;

  constructor() {
    super();

    this._debug = false;
    
    this.loadGLTF('monitor-stand.gltf', () => {
      console.log(this.children);
      this._slot = this.children.find((child) => (child.name === 'slot-0'));
      this._occupied = this.children.find((child) => (child.name === 'occupied'));
      console.log('occupied', this._occupied);
      console.log('slot', this._slot);

      // draw the slot
      if (this._debug && this._slot) {
        const helper = new Box3Helper(this.getBox(this._slot as Mesh), new Color(0x12FC4C));
        this._boxHelper = helper;
        this.add(helper);
        this._boxHelper.box = this.getBox(this._slot as Mesh);
      }
    })
  }

  /**
   * Get the surface can be used for content object
   * The moving area
   * 
   * @returns {min, max}
   */
  public getContainerBox() {
    return this.getBox(this._slot as Mesh);
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    // use occupied area to calculate the restrict movement area
    const bbox = new Box3().setFromObject(this._occupied as Mesh);
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