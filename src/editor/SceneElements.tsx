import GUI from 'lil-gui';
import Stats from 'stats.js';
import * as THREE from 'three';

export const getScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#cccccc');
  return scene;
}

export const getCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  // const camera = new THREE.OrthographicCamera(75, width / height, 0.1, 1000);
  camera.position.set(2, 5, -6);
  camera.rotation.set(0, 0, 0)
  return camera;
}
export const getOrthographicCamera = (width: number, height: number) => {
  // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000);
  // camera.far= 10
  // camera.position.set(30, 0, 0);
  // camera.rotation.set(0, 0, 0)
  return camera;
}

export const getLights = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.66);
  ambientLight.position.set(0, 3, 0);
  scene.add(ambientLight);

  const directionLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionLight.position.set(13.5, 15, -12.5);
  scene.add(directionLight);

  // const pointLight = new THREE.PointLight(0xffffff, 1);
  // scene.add(pointLight);

  // const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 10, 0xff0000);
  // scene.add(directionLightHelper);
}

export const getRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setSize(width, height);
  // VR support
  // renderer.xr.enabled = true;
  return renderer;
}


export const getGUIPanel = () => {
  const panel = new GUI({ width: 310 });

  // const myObject = {
  //   myBoolean: true,
  //   myFunction: function () { },
  //   myString: 'lil-gui',
  //   myNumber: 1
  // };

  // panel.add(myObject, 'myNumber')
  //   .name('Custom Name')
  //   .onChange((value: number) => {
  //     console.log(value);
  //   });
  // const folder1 = panel.addFolder('Base Actions');
  // const folder2 = panel.addFolder('Additive Action Weights');
  // const folder3 = panel.addFolder('General Speed');

  return panel;
}

export const getGirds = () => {
  const grid = new THREE.GridHelper(10, 20, 0xffffff, 0xffffff);
  // grid.material.opacity = 0.5;
  // grid.material.depthWrite = false;
  // grid.material.transparent = true;
  return grid;
}

export const addGroundAndWall = () => {
  
}

export const getStats = () => {
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  return stats;
}