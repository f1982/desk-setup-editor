import { Camera, EventDispatcher, Mesh, Raycaster, Renderer, Scene, Vector2 } from 'three';
import DSEObject from '../../models/DSEObject';

function findAllMeshes(scene: Scene): Mesh[] {

  const allMesh: Mesh[] = [];

  const getMeshes = (obj: DSEObject) => {
    const meshes: Mesh[] = obj.children.filter(item => (item instanceof Mesh)) as Mesh[];
    allMesh.push(...meshes)
    obj.kids.forEach((subObj: DSEObject) => {
      getMeshes(subObj)
    });
  }

  const room = scene.children.find(item => item.name === 'displayRoom');
  if (room){
    getMeshes(room as DSEObject);
  }

  return allMesh;
}

function findAllDSEObjects(scene: Scene): DSEObject[] {

  const allObjects: DSEObject[] = [];

  const getObject = (obj: DSEObject) => {
    allObjects.push(...obj.kids);
    obj.kids.forEach((subObj: DSEObject) => {
      getObject(subObj)
    });
  }
  
  const room = scene.children.find(item => item.name === 'displayRoom');
  if (room){
    getObject(room as DSEObject);
  }
  
  console.log('allObjects', allObjects);
  return allObjects;
}

export const SelectObjectEvent = "selectObjectEvent";

class RayCasterControl extends EventDispatcher {

  scene?: Scene;
  camera?: Camera;
  renderer?: Renderer;

  rayCaster?: Raycaster;
  rayPointer: Vector2 = new Vector2();
  selectedObj: DSEObject | null = null;

  constructor({
    scene, camera, renderer
  }: {
    scene: Scene,
    camera: Camera,
    renderer: Renderer
  }) {
    super();

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.init();
  }

  init() {
    const rayCaster = new Raycaster();
    // this.renderer!.domElement.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.renderer!.domElement.addEventListener('pointerup', this.handlePointerDown.bind(this))
    this.rayCaster = rayCaster;
  }

  handlePointerDown(event: PointerEvent) {
    // update ray caster pointer
    const domElement = this.renderer!.domElement;
    const rect = domElement.getBoundingClientRect();
    this.rayPointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    this.rayPointer.y = - (event.clientY - rect.top) / rect.height * 2 + 1;

    this.rayCaster!.setFromCamera(this.rayPointer, this.camera!);

    // get and set the object can be interacted with
    // const selectableElements = getMovableMeshes(this.scene!);
    // get and set the object can be interacted with
    const selectableElements = findAllDSEObjects(this.scene!);
    const intersects = this.rayCaster!.intersectObjects<DSEObject>(selectableElements, true);

    if (
      intersects.length > 0 &&
      intersects[0].object.parent instanceof DSEObject
    ) {

      const selected = intersects[0].object.parent;
      this.dispatchEvent({ type: SelectObjectEvent, selected: selected });

    } else {
      this.dispatchEvent({ type: SelectObjectEvent, selected: null });
    }
  }

  dispose() {
    this.renderer!.domElement.removeEventListener('pointerdown', this.handlePointerDown.bind(this));

    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.rayCaster = undefined;
  }
}

export default RayCasterControl;