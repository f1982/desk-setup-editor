import GUI from 'lil-gui';
import { BoxHelper, Group, MathUtils, Mesh, Vector3 } from 'three';

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

class DSEObject extends Group {

  public objType: ObjectCategory = ObjectCategory.None;

  protected restrictMin: Vector3 = new Vector3(-2, -2, -2);
  protected restrictMax: Vector3 = new Vector3(2, 2, 2);

  protected _container: Group;
  protected selectedIndicator: Mesh;

  protected _guiFolder?:GUI;

  public get container() {
    return this._container
  }

  protected initContainer() {
    this._container = new Group();
    this.add(this._container);
  }

  public setGUI(gui: GUI) {
  }

  public removeGUI(){
    this._guiFolder?.destroy();
  }
  
  /**
   * Update the container size
   * @param max 
   * @param min 
   */
  public updateRestrictArea(min: Vector3, max: Vector3) {
    this.restrictMin = min;
    this.restrictMax = max;
  }

  public getRandomPosition() {
    const { min, max } = this.getRestrictArea();
    return new Vector3(
      MathUtils.randInt(min.x, max.x),
      MathUtils.randInt(min.y, max.y),
      MathUtils.randInt(min.z, max.z)
    )
  }

  /**
   * Get the min and max coordinates of the object can move in 
   * It will be override by specific model component
   * 
   * @returns 
   */
  public getRestrictArea(): { min: Vector3, max: Vector3 } {
    return { min: new Vector3(), max: new Vector3() }
  }

  /**
   * Get the surface can be used for content object
   * The moving area
   * 
   * @returns {min, max}
   */
  public getContainerBox() {
    return { min: new Vector3(), max: new Vector3() }
  }

  /**
   * Add this box helper will increase the click area or drag area
   */
  protected addBoxHelper() {
    var helper = new BoxHelper(this, 0x1CFA49);
    helper.update();
    // If you want a visible bounding box
    this.add(helper);
  }
}

export default DSEObject;