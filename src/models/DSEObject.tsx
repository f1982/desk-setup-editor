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

  protected _guiFolder?: GUI;

  protected _kids: DSEObject[] = []

  public get container() {
    return this._container
  }

  protected initContainer() {
    this._container = new Group();
    this.add(this._container);
  }

  public setGUI(gui: GUI) {
  }

  public removeGUI() {
    this._guiFolder?.destroy();
  }

  public get kids () {
    return this._kids;
  }
  
  public addKid(kid: DSEObject) {
    this._kids.push(kid);
    this.add(kid);
    this.updateChildrenRestrictArea();
  }

  /**
   * Update the container size
   * @param max 
   * @param min 
   */
  public updateRestrictArea(min: Vector3, max: Vector3) {
    // console.log(this,'updateRestrictArea', min, max);
    this.restrictMin = min;
    this.restrictMax = max;
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

  public getRandomPosition() {
    const { min, max } = this.getRestrictArea();
    return new Vector3(
      MathUtils.randFloat(min.x, max.x),
      MathUtils.randFloat(min.y, max.y),
      MathUtils.randFloat(min.z, max.z)
    )
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

  public updateChildrenRestrictArea() {
    // console.log('updateChildrenRestrictArea');
    if(this._kids.length<=0){
      return;
    }
    const { min, max } = this.getContainerBox();
    this._kids.forEach(obj => {
      obj.updateRestrictArea(min, max);
    });
  }

  // public move() {
  //   this._kids.forEach(obj => {
  //     // obj.position.copy(this.position.add())
  //   });
  // }
}

export default DSEObject;