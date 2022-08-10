import gsap from 'gsap';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';


export const loadScene = (callback: (objects: THREE.Group) => void) => {
  // Instantiate a loader
  const loader = new GLTFLoader();
  // Load a glTF resource
  loader.load(
    // resource URL
    'https://raw.githubusercontent.com/f1982/planet-of-images/main/img/my-room-v0.69.gltf',
    // called when the resource is loaded
    (gltf: GLTF) => {
      callback(gltf.scene)

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


export const getCubeGroup = () => {
  const geo = new THREE.BoxGeometry(20, 20, 20);

  const group = new THREE.Group();

  for (let i = 0; i < 200; i += 1) {
    const object = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
    );

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;

    gsap.to(object.rotation, {
      duration: 19, y: Math.PI * 2, repeat: -1, ease: 'none',
    });

    group.add(object);
  }
  return group

}
