
import { saveAs } from 'file-saver';
import gsap from 'gsap';
import * as THREE from 'three';
import { Box3, Mesh, Quaternion, Vector3 } from 'three';
import { STLExporter } from 'three-stdlib';
import DSEObject from '../models/DSEObject';
// import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

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

function getObjectSize(mesh: Mesh) {
  const bbox = new Box3().setFromObject(mesh);
  let size = new Vector3();
  bbox.getSize(size);
  return size
}

const VecZero = () => new Vector3(0, 0, 0);

// Use FileSaver.js 'saveAs' function to save the string
async function saveSTL(scene: THREE.Object3D, name: string) {
  // const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter');
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
  // camera position
  const targetPosition = new Vector3();
  target.getWorldPosition(targetPosition);


  // camera  position
  const startPosition = new Vector3().copy(camera.position);
  // const endPosition = targetPosition.add(offset);
  const endPosition = new Vector3().copy(targetPosition).add(offset);

  const startQuaternion = new THREE.Quaternion().copy(camera.quaternion);

  camera.position.copy(endPosition);
  // either
  camera.lookAt(targetPosition);
  // camera.lookAt(target.position);
  //or
  // let wp = new Vector3();
  // target.getWorldPosition(wp);
  // camera.lookAt(wp); 

  const endQuaternion = new THREE.Quaternion().copy(camera.quaternion);

  camera.quaternion.copy(startQuaternion);
  camera.position.copy(startPosition);


  const time = { t: 0 };

  // move time
  gsap.to(time, {
    duration: 1,
    t: 1,
    onUpdate: () => {

      // position
      const p = new Vector3();
      p.lerpVectors(startPosition, endPosition, time.t);
      camera.position.copy(p);

      // rotation
      const qm = new Quaternion();
      qm.slerpQuaternions(startQuaternion, endQuaternion, time.t);
      camera.quaternion.copy(qm);

    },
    onComplete: () => {
      console.log('move end');
      callback?.();
    }
  });

  // // move camera
  // gsap.to(camera.position, {
  //   duration: 1,
  //   x: endPosition.x,
  //   y: endPosition.y,
  //   z: endPosition.z,
  //   onUpdate: () => {
  //     // keep camera facing to the target object
  //     // camera.lookAt(target.getWorldPosition(targetPosition));
  //     const qm = new THREE.Quaternion();
  //     qm.slerpQuaternions(startQuaternion, endQuaternion, time.t);
  //     camera.quaternion.copy(qm);
  //   },
  //   onComplete: () => {
  //     console.log('move end');
  //     callback?.();
  //   }
  // });
}

export {
  getDSEObjects,
  getDSEObject,
  findType,
  saveSTL,
  moveCameraToObject,
  VecZero,
  getObjectSize
};

