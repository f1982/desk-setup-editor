import GUI from 'lil-gui';
import { Box3, BoxHelper, Group, MathUtils } from 'three'
import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import gsap from 'gsap'

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

// type ObjTypes = '' | 'MovableObject' | 'StaticObject';

class DSEObject extends Group {

  public objType: ObjectCategory = ObjectCategory.None;

  protected restrictMin: Vector3 = new Vector3(-2, -2, -2);
  protected restrictMax: Vector3 = new Vector3(2, 2, 2);

  protected _container: Group;
  protected selectedIndicator: Mesh;
  protected _gsapTween?: GSAPTween;

  protected _guiFolder?:GUI;

  constructor() {
    super();

    this.initSelectedIndicator();
  }

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

  protected initSelectedIndicator() {
    const geo = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshLambertMaterial({ color: 0xff0000 });
    this.selectedIndicator = new Mesh(geo, material);
    this.selectedIndicator.position.set(0, 1, 0);
    this._gsapTween = gsap.to(this.selectedIndicator.rotation, { duration: 1, y: Math.PI * 2, repeat: -1, ease: "none" });
    this._gsapTween.pause();
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
      // MathUtils.randInt(max.x, min.x),
      // MathUtils.randInt(max.y, min.y),
      // MathUtils.randInt(max.z, min.z)
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

  public select() {
    // console.log('object select')
    // this.setGUI();

    const bbox = new Box3().setFromObject(this);
    this.add(this.selectedIndicator);
    this.selectedIndicator.position.set(0, bbox.max.y, 0);

    this._gsapTween?.play();
  }

  public unselect() {
    console.log('object unselected')
    this._gsapTween?.pause();
    // this._gsapTween = undefined;
    // gsap.killTweensOf(this.selectedIndicator.rotation)

    this.remove(this.selectedIndicator)
  }
}

export default DSEObject;