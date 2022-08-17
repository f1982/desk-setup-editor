
import { saveAs } from 'file-saver';
import * as THREE from 'three';
import { Vector3 } from 'three';
import gsap from 'gsap';
import DSEObject from '../models/DSEObject';

function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
}

function getDSEObjects(scene: THREE.Scene) {
  const objs = scene.children.filter((item: THREE.Object3D) => {
    return item instanceof DSEObject && item.name !== 'displayRoom'
  });
  return objs;
}

function getDSEObject(scene: THREE.Scene, name: string) {
  return scene.children.find((item: THREE.Object3D) => item instanceof DSEObject && item.name === name);
}

// Use FileSaver.js 'saveAs' function to save the string
async function saveSTL(scene: THREE.Object3D, name: string) {
  const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter');
  // const { STLExporter } = await import('three-stdlib/exporters/STLExporter');
  const exporter = new STLExporter();
  const stlString = exporter.parse(scene, { binary: false });

  const blob = new Blob([stlString], { type: 'text/plain' });

  saveAs(blob, name + '.stl');
}


/**
   * Move camera to look at an object with animation
   * 
   * @param camera 
   * @param target the object want to be focus by camera
   * @param offset specify a distance between object and the camera
   */
function moveCameraToObject(
  camera: THREE.Camera,
  target: THREE.Object3D,
  offset: Vector3 = new Vector3(0, 5, -5),
  callback?: () => void
) {
  const targetPosition = new Vector3();
  target.getWorldPosition(targetPosition);

  // camera end position
  const endPosition = targetPosition.add(offset);

  // stop orbit control
  // this.orbit!.enabled = false;

  // move camera
  gsap.to(camera.position, {
    duration: 1,
    x: endPosition.x,
    y: endPosition.y,
    z: endPosition.z,
    onUpdate: () => {
      // keep camera facing to the target object
      camera.lookAt(target.getWorldPosition(targetPosition));
    },
    onComplete: () => {
      console.log('move end');
      callback?.();
    }
  });
}

export {
  getDSEObjects,
  getDSEObject,
  findType,
  saveSTL,
  moveCameraToObject
};

