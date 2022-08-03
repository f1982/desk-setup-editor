// @ts-ignore
import * as THREE from 'three';
import gsap from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { vertex as basicVertex, fragment as basicFragment } from '../../shaders/index';
import { getCubeGroup, getCamera, getLights, getRenderer, getScene, loadScene } from '../../SceneElements';
import { addControl } from '../../Controllers';
import SimpleDesk from '../../models/SimpleDesk';

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
  private camera: THREE.PerspectiveCamera;
  // @ts-ignore
  private renderer: THREE.WebGLRenderer;
  // @ts-ignore
  private composer: EffectComposer;
  // @ts-ignore
  private clock: THREE.Clock;

  constructor(options: IOptions) {
    this.initScene(options);
    this.initElements();
    this.initControl();
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
  }

  initElements() {
    // this.scene.add(getCubeGroup());
    // loadScene((obj: THREE.Group) => {
    //   this.scene.add(obj);
    // });

    const desk = new SimpleDesk({width:20,depth:10});
    desk.position.set(0,0,0)
    this.scene.add(desk);
  }

  initControl() {
    addControl(this.camera, this.renderer.domElement)
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

  public setAnimationLoop(callback: XRFrameRequestCallback) {
    this.renderer.setAnimationLoop(callback);
  }

  render() {
    // check if we need to resize the canvas and re-setup the camera
    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      // @ts-ignore
      this.camera.updateProjectionMatrix();
    }
    this.composer.render();
  }
}

export default ThreeCanvas;
