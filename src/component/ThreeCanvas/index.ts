// @ts-ignore
import * as THREE from 'three';
import gsap from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { vertex as basicVertex, fragment as basicFragment } from '../../shaders/index';
import { getCamera, getGirds, getGUIPanel, getLights, getRenderer, getScene, getStats } from '../../SceneElements';
import { addControl } from '../../Controllers';
import SimpleDesk from '../../models/SimpleDesk';
import Stats from 'stats.js';
import { getCubeGroup, loadScene } from '../../models';
import GUI from 'lil-gui';

// use this tool to help you to locate the position of the light and cameras
// https://threejs.org/editor/
interface IOptions {
  mountPoint: HTMLDivElement;
  width: number;
  height: number;
}

class ThreeCanvas {
  // @ts-ignore
  public scene: THREE.Scene;
  // @ts-ignore
  private camera: THREE.PerspectiveCamera;
  // @ts-ignore
  private renderer: THREE.WebGLRenderer;
  // @ts-ignore
  private composer: EffectComposer;
  // @ts-ignore
  private clock: THREE.Clock;
  // @ts-ignore
  private stats: Stats;

  private gui: GUI;

  constructor(options: IOptions) {
    this.initScene(options);
    this.initTools();
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

    const lights = getLights(this.scene);

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

  initTools() {
    this.scene.add(getGirds());
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    this.gui = getGUIPanel();


    this.stats = getStats();
    document.body.append(this.stats.dom)
  }

  initElements() {
    // this.scene.add(getCubeGroup());

    // loadScene((obj: THREE.Group) => {
    //   this.scene.add(obj);
    // });

    const desk = new SimpleDesk();
    desk.setGUI(this.gui);
    this.scene.add(desk);
  }

  initControl() {
    addControl(this.camera, this.renderer.domElement);
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
    this.stats.begin();

    // check if we need to resize the canvas and re-setup the camera
    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      // @ts-ignore
      this.camera.updateProjectionMatrix();
    }
    this.composer.render();
    this.stats.end();
  }
}

export default ThreeCanvas;
