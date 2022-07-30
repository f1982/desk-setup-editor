// @ts-ignore
import * as THREE from 'three';
import { Mesh, Vector3, MathUtils } from 'three';
import { GLTFLoader } from 'three-stdlib';
// import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
// import theme from 'utils/theme';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
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
      // new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
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

function addMeshes(scene: THREE.Scene) {
  const cubeGroup = new THREE.Group();
  const cubeInitialPositions = [
    {
      rotation: new Vector3(35, 35, 0),
      position: new Vector3(0, -0.5, 0),
    },
    {
      rotation: new Vector3(-35, -95, 0),
      position: new Vector3(0, 1, 0),
    },
  ];

  // some standard material or ShaderMaterial
  // const material = new THREE.MeshBasicMaterial( { color: theme.baseFontColor } );
  const material = new THREE.ShaderMaterial({
    // transparent: true,
    side: THREE.DoubleSide,
    // vertexShader: basicVertex,
    // fragmentShader: basicFragment,
    uniforms: {
      time: { value: 0 },
    },
  });

  for (let i = 0; i < 20; i += 1) {
    const geometry = new THREE.BoxGeometry(20, 20, 20);

    const object = new Mesh(geometry, material);
    cubeGroup.add(object);

    object.position.x = Math.random() * 200 - 100;
    object.position.y = Math.random() * 200 - 100;
    object.position.z = Math.random() * 200 - 100;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;
  }

  cubeGroup.position.z = -7; // push 7 meters back
  // gsap.to(this.cubeGroup.rotation, {
  //   duration: 19, y: Math.PI * 2, repeat: -1, ease: 'none',
  // });
  scene.add(cubeGroup);
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

    // addMeshes(this.scene);
    //@ts-ignore
    addCube(this.scene);
    // loadGTLF(this.scene, (sceneList) => {
    //   const kids = sceneList[0].children.filter((child) => (child.type === 'Mesh'));
    //   // console.log('kids', kids);
    //   this.addDragAndDrop(kids);
    // });
  }

  initScene(options:any) {
    const { mountPoint, width, height } = options;

    // basics
    this.clock = new THREE.Clock();

    // scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color('#ffffff');
    this.scene.background = new THREE.Color(0xf0f0f0);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // this.camera = new THREE.PerspectiveCamera(
    //   70, window.innerWidth / window.innerHeight, 1, 10000
    // );
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

    // this.addControl();
  }

  addLights() {
    // light
    const ambientLight = new THREE.AmbientLight(0x505050, 4);
    ambientLight.position.set(0, 3, 0);
    this.scene.add(ambientLight);

    // const light = new THREE.SpotLight(0xffffff, 1.5);
    // light.position.set(3, 5, -2);
    // light.angle = Math.PI / 9;

    // light.castShadow = true;
    // light.shadow.camera.near = 100;
    // light.shadow.camera.far = 4000;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;
    // this.scene.add(light);

    const directionLight = new THREE.DirectionalLight(0xffffff, 6);
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
