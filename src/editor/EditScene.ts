// @ts-ignore
import * as THREE from 'three';
import gsap from 'gsap';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { vertex as basicVertex, fragment as basicFragment } from '../shaders/index';
import { getCamera, getGirds, getGUIPanel, getLights, getOrthographicCamera, getRenderer, getScene, getStats } from './SceneElements';
import GlobalController, { addControl, addDragAndDrop } from './Controllers';
import SimpleDesk from '../models/SimpleDesk';
import Stats from 'stats.js';
import { getCubeGroup, loadScene } from '../models';
import GUI from 'lil-gui';
import DisplayRoom from '../models/DisplayRoom';
import Mug from '../models/Mug';
import DSEObject from '../models/DSEObject';
import SetupObjects from './SetupObjects';

// use this tool to help you to locate the position of the light and cameras
// https://threejs.org/editor/
interface IOptions {
  mountPoint: HTMLDivElement;
  width: number;
  height: number;
}

class ThreeCanvas {

  public scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  private composer: EffectComposer;
  private clock: THREE.Clock;

  private camera: THREE.Camera;
  private perspectiveCamera: THREE.PerspectiveCamera;
  private orthographicCamera: THREE.OrthographicCamera;

  // @ts-ignore
  private stats: Stats;

  private gui: GUI;

  private setupObjects: SetupObjects;

  public movableObjects: DSEObject[] = [];

  constructor(options: IOptions) {
    this.initScene(options);
    this.initTools();
    this.initElements();
    this.initControl();
  }

  public switchToSTLScene() {
    // remove controller from scene
    // controller.removeTransformController()
  }

  public resetNormalScene() {

  }

  private initScene(options: IOptions) {
    const { mountPoint, width, height } = options;
    // basics
    this.clock = new THREE.Clock();
    // scene
    this.scene = getScene();

    this.perspectiveCamera = getCamera(width, height);
    this.orthographicCamera = getOrthographicCamera(width, height);

    this.camera = this.perspectiveCamera;

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

  private initTools() {
    this.scene.add(getGirds());
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    this.gui = getGUIPanel();

    this.stats = getStats();
    document.body.append(this.stats.dom)
  }

  initElements() {
    this.setupObjects = new SetupObjects(this.scene, this.gui);

  }

  initControl() {
    // addControl(this.camera, this.renderer.domElement);
    const ctrl = new GlobalController(this.scene, this.camera, this.renderer);
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

      if (this.camera === this.perspectiveCamera) {
        this.perspectiveCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.perspectiveCamera.updateProjectionMatrix();
      } else {
        this.orthographicCamera.updateProjectionMatrix();
      }
      this.composer.render();
      this.stats.end();
    }
  }
}

export default ThreeCanvas;
