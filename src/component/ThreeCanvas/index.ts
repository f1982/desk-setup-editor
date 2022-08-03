// @ts-ignore
import * as THREE from 'three';
import gsap from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { vertex as basicVertex, fragment as basicFragment } from '../../shaders/index';
import { addControl, getCubeGroup, getCamera, getLights, getRenderer, getScene, loadScene } from '../../SceneElements';

// use this tool to help you to locate the position of the light and cameras
// https://threejs.org/editor/
interface IOptions {
  mountPoint: HTMLDivElement;
  width: number;
  height: number;
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
    this.scene.add(getCubeGroup())
    loadScene((obj: THREE.Group) => {
      this.scene.add(obj);
    })
  }

  initScene(options: IOptions) {
    const { mountPoint, width, height } = options;
    // basics
    this.clock = new THREE.Clock();
    // scene
    this.scene = getScene();
    this.camera = getCamera(width, height);

    const lights = getLights();
    lights.forEach(light => {
      this.scene.add(light);
    })

    this.renderer = getRenderer(width, height);

    // post processing support
    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = false;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);

    // mount to DOM
    mountPoint.appendChild(this.renderer.domElement);
    // mountPoint.appendChild(VRButton.createButton(this.renderer));

    addControl(this.camera, this.renderer.domElement)
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
