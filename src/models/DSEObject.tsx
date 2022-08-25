import GUI from 'lil-gui';
import { Box3, Box3Helper, BoxHelper, Group, MathUtils, Mesh, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

class DSEObject extends Group {

  public _objectType: ObjectCategory = ObjectCategory.None;

  protected restrictMin: Vector3 = new Vector3(-2, -2, -2);
  protected restrictMax: Vector3 = new Vector3(2, 2, 2);


  protected _guiFolder?: GUI;
  // sub dse object, not the mesh of the current object
  protected _kids: DSEObject[] = []
  protected _debug: boolean = false;

  public setGUI(gui: GUI) {
  }

  public removeGUI() {
    this._guiFolder?.destroy();
  }

  public get kids() {
    return this._kids;
  }

  public addKid(kid: DSEObject) {
    this._kids.push(kid);
    this.add(kid);
    this.updateChildrenRestrictArea();
  }

  public removeAllKids() {
    if (this._kids.length < 1) return;
    this._kids.forEach(item => {
      this.remove(item);
    })
    this._kids.length = 0;
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
   * clamp object inside the constraint area
   */
  public clampIn() {
    const { min, max } = this.getRestrictArea()
    this.position.clamp(max, min);
  }

  /**
   * get random position inside constraint area
   * 
   * @returns Vector3 position
   */
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
   * Update the container size
   * @param max 
   * @param min 
   */
  public updateRestrictedArea(min: Vector3, max: Vector3) {
    this.restrictMin = min;
    this.restrictMax = max;
  }

  /**
   * Tell all kids to know which area can be moved in
   * Clamp kids inside the constraint area
   * 
   * @returns 
   */
  public updateChildrenRestrictArea() {
    if (this._kids.length <= 0) {
      return;
    }
    const { min, max } = this.getContainerBox();
    this._kids.forEach(obj => {
      obj.updateRestrictedArea(min, max);
      obj.clampIn();
    });
  }

  protected loadGLTF(filename: string, callback?: () => void) {
    const url = process.env.PUBLIC_URL + '/static/models/' + filename;

    // Instantiate a loader
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      (gltf: GLTF) => {
        this.add(...gltf.scene.children);
        callback?.();

        //TODO: move to somewhere else
        this.position.copy(this.getRandomPosition());
      },
      // called while loading is progressing
      (xhr: ProgressEvent) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // called when loading has errors
      (error) => {
        console.log('An error  happened');
      },
    );
  }


}

export default DSEObject;