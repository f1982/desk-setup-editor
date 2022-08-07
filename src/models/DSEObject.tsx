import * as THREE from 'three'
import { Vector3 } from 'three';

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

type ObjTypes = '' | 'MovableObject' | 'StaticObject';

class DSEObject extends THREE.Group {

  public objType: ObjectCategory = ObjectCategory.None;

  protected restrictMin: Vector3 = new Vector3(-2, -2, -2);
  protected restrictMax: Vector3 = new Vector3(2, 2, 2);

  constructor() {
    super();
  }

  /**
   * Update the container size
   * @param max 
   * @param min 
   */
  public updateRestrictArea(max: Vector3, min: Vector3) {
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

  public getContainerBox () {
    return { min: new Vector3(), max: new Vector3() }
  }
  
}

export default DSEObject;