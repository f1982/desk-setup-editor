import { OrbitControls, DragControls } from "three-stdlib";

export const addControl = (camera: THREE.Camera, domElement: HTMLElement) => {
  const controls = new OrbitControls(camera, domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  return controls;
}

export const addDragAndDrop = (
  camera: THREE.Camera,
  domElement: HTMLElement,
  objects: THREE.Mesh
) => {
  // @ts-ignore
  const controls = new DragControls(objects, this.camera, this.renderer.domElement);

  // add event listener to highlight dragged objects
  controls.addEventListener('dragstart', (event) => {
    event.object.material.emissive.set(0xaaaaaa);
  });

  controls.addEventListener('drag', (event) => {
    // This will prevent moving z axis, but will be on 0 line.
    // change this to your object position of z axis.
    const p = event.object.position;
    // event.object.position.set(p.x, p.y, 0);
  });

  controls.addEventListener('dragend', (event) => {
    event.object.material.emissive.set(0x000000);
  });
}