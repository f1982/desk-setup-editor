import { Camera, EventDispatcher, Mesh, Object3D, Raycaster, Renderer, Scene, Vector2 } from 'three'
import DSEObject from '../../models/DSEObject';

/**
 * Get all the meshes that can be interacted with 
 * 
 * @param scene current scene
 * @returns mesh array
 */
function getMovableMeshes(scene: THREE.Scene) {
  // const dseObjects = scene.children.filter((item: THREE.Object3D) => {
  //   return item instanceof DSEObject && item.name !== 'displayRoom'
  // });

  const dseObjects = scene.children.filter((item: THREE.Object3D) => item instanceof DSEObject);

  const meshes: any[] = [];
  dseObjects.forEach(element => {
    // put all mesh inside dse object into list
    const elementMeshes = element.children.filter(item => (item instanceof Mesh));
    meshes.push(...elementMeshes);

    // if the dse object has container
    if ((element as DSEObject).container) {
      // find all the sub dse object inside the container
      const subObjs = (element as DSEObject).container.children.filter(item => (item instanceof DSEObject));
      // put all the sub dse object meshes into mesh list
      subObjs.forEach((item) => {
        const subMeshes = item.children.filter(subItem => (subItem instanceof Mesh));
        meshes.push(...subMeshes);
      })
    }
  });
  return meshes;
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
    this.renderer!.domElement.addEventListener('pointerdown', this.handlePointerDown.bind(this))
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
    const selectableElements = getMovableMeshes(this.scene!);
    const intersects = this.rayCaster!.intersectObjects<Object3D>(selectableElements, true);

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