import GUI from 'lil-gui';
import * as THREE from 'three'
import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import gsap from 'gsap'

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

// type ObjTypes = '' | 'MovableObject' | 'StaticObject';

class DSEObject extends THREE.Group {

  public objType: ObjectCategory = ObjectCategory.None;

  protected restrictMin: Vector3 = new Vector3(-2, -2, -2);
  protected restrictMax: Vector3 = new Vector3(2, 2, 2);

  protected selectedIndicator: Mesh;

  constructor() {
    super();

    this.initSelectedIndicator();
  }

  public setGUI(gui: GUI) {
  }

  protected initSelectedIndicator() {
    const geo = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshLambertMaterial({ color: 0xff0000 });
    this.selectedIndicator = new Mesh(geo, material);
    this.selectedIndicator.position.set(0,1,0);
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

  public select() {
    console.log('object select')
    this.add(this.selectedIndicator);
    gsap.to(this.selectedIndicator.rotation, { duration: 10, y: Math.PI * 2, repeat: -1, ease: "none" });
  }

  public unselect() {
    console.log('object unselected')


    this.remove(this.selectedIndicator)
  }
}

export default DSEObject;