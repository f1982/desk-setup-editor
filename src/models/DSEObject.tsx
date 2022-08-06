import * as THREE from 'three'

export enum ObjectCategory {
  Movable = "Movable",
  Static = "Static",
  None = "",
}

type ObjTypes = '' | 'MovableObject' | 'StaticObject';

class DSEObject extends THREE.Group {
  public objType: ObjectCategory = ObjectCategory.None

  constructor() {
    super();
  }
}

export default DSEObject;