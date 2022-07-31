// @ts-ignore
import * as THREE from 'three';
// import gsap from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { vertex as basicVertex, fragment as basicFragment } from './shaders/basic';

// use this tool to help you to locate the position of the light and cameras
// https://threejs.org/editor/
interface IOptions {
  mountPoint: HTMLDivElement;
  width: number;
  height: number;
}

function addCube(scene: THREE.Scene) {
  const geo = new THREE.BoxGeometry(20, 20, 20);

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

    scene.add(object);
  }
}

function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
}


class ThreeCanvas {
  // @ts-ignore
  private scene: THREE.Scene;
  // @ts-ignore
  private camera: THREE.Camera;
  // @ts-ignore
  private renderer: THREE.WebGLRenderer;
  // @ts-ignore
  private composer: EffectComposer;
  // @ts-ignore
  private clock: THREE.Clock;

  constructor(options: IOptions) {
    this.initScene(options);

    //@ts-ignore
    addCube(this.scene);
  }

  initScene(options:any) {
    const { mountPoint, width, height } = options;
    // basics
    this.clock = new THREE.Clock();
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0.5, 1.5);
    // this.camera.position.z = 0;

    this.addLights();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(width, height);
    // VR support
    // renderer.xr.enabled = true;

    // post processing support
    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = false;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);

    // mount to DOM
    mountPoint.appendChild(this.renderer.domElement);
    // mountPoint.appendChild(VRButton.createButton(this.renderer));

    this.addControl();
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0x505050, 4);
    ambientLight.position.set(0, 3, 0);
    this.scene.add(ambientLight);

    const directionLight = new THREE.DirectionalLight(0xffffff, 3);
    directionLight.position.set(3.5, 5, -2.5);
    this.scene.add(directionLight);
  }

  addControl() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
  }

  addDragAndDrop(objects: THREE.Mesh) {
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

  resizeRendererToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      this.renderer.setSize(width, height, false);
      this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2),
      ); // use 2x pixel ratio at max
    }

    return needResize;
  }

  public setAnimationLoop(callback: Function) {
    // @ts-ignore
    this.renderer.setAnimationLoop(callback);
  }

  render() {
    // check if we need to resize the canvas and re-setup the camera
    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      // @ts-ignore
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      // @ts-ignore
      this.camera.updateProjectionMatrix();
    }

    this.composer.render();
  }
}

export default ThreeCanvas;
