import GUI from 'lil-gui';
import Stats from 'stats.js';
import { AmbientLight, BoxGeometry, Clock, Color, DirectionalLight, GridHelper, Mesh, MeshLambertMaterial, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { EffectComposer, OrbitControls, RenderPass } from 'three-stdlib';

export class ThreeSceneBase {
  protected _clientWidth: number;
  protected _clientHeight: number;
  protected _mountPoint: HTMLDivElement;

  protected _scene: Scene;
  protected _renderer: WebGLRenderer;
  protected composer: EffectComposer;

  protected _clock: Clock;
  protected _camera: PerspectiveCamera;

  protected _gui: GUI;
  // for testing
  // protected _box: Mesh;

  protected _addObjectCallback: (scene: Scene, gui: GUI) => void;

  set addObject(fun: (scene: Scene, gui:GUI) => void) {
    this._addObjectCallback = fun
  }

  init({
    mountPoint,
    width,
    height,
  }: {
    mountPoint: HTMLDivElement,
    width: number,
    height: number
  }) {
    this._clientWidth = width;
    this._clientWidth = height;
    this._mountPoint = mountPoint;

    this.initSetups();
    this.initControl();

    this.initObjects();

    this._addObjectCallback?.(this._scene, this._gui);
  }

  initSetups() {
    const scene = new Scene();
    scene.background = new Color('#cccccc');
    this._scene = scene;

    const grid = new GridHelper(10, 50, 0xffffff, 0xffffff);
    this._scene.add(grid);

    const ambientLight = new AmbientLight(0xffffff, 0.66);
    ambientLight.position.set(0, 3, 0);
    this._scene.add(ambientLight);

    const directionLight = new DirectionalLight(0xffffff, 0.8);
    directionLight.position.set(13.5, 15, -12.5);
    this._scene.add(directionLight);

    const camera = new PerspectiveCamera(50, this._clientWidth / this._clientHeight, 0.1, 1000);
    // const camera = new OrthographicCamera(75, this._clientWidth / this._clientHeight, 0.1, 1000);
    camera.position.set(5, 3, -5);
    camera.lookAt(new Vector3(0, 0, 0));
    // camera.rotation.set(0, 0, 0)
    this._camera = camera;

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(this._clientWidth, this._clientHeight);
    this._renderer = renderer;

    const renderPass = new RenderPass(this._scene, this._camera);
    renderPass.clear = false;

    this.composer = new EffectComposer(this._renderer);
    this.composer.addPass(renderPass);

    // mount to DOM
    this._mountPoint.appendChild(this._renderer.domElement);

    const stats = new Stats();
    stats.showPanel(0);
    this.stats = stats;
  }

  protected initControl() {
    this._gui = new GUI({ width: 210 });
    
    const orbit = new OrbitControls(this._camera, this._renderer.domElement);
    orbit.enablePan = false;
    orbit.enableDamping = true;
    orbit.update();
    // orbit.addEventListener('change', () => { });
  }

  protected initObjects() {
    // const geo = new BoxGeometry(1, 1, 1);
    // const material = new MeshLambertMaterial({ color: 0xffcc00 });
    // const box = new Mesh(geo, material);
    // this.scene.add(box);
    // this._box = box;
  }

  protected resizeRendererToDisplaySize() {
    const canvas = this._renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      this._renderer.setSize(width, height, false);
      this._renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2),
      ); // use 2x pixel ratio at max
    }

    return needResize;
  }

  protected render() {
    // this._box.rotation.set(
    //   this._box.rotation.x + 0.01,
    //   this._box.rotation.y + 0.01,
    //   this._box.rotation.z + 0.01
    // )
  };

  public dispose() {
    this._gui?.destroy();
    this._renderer.domElement.remove()
  };

  public startAnimationLoop() {
    this._renderer.setAnimationLoop(() => {
      // resize if it needs
      if (this.resizeRendererToDisplaySize()) {
        const canvas = this._renderer.domElement;
        this._camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this._camera.updateProjectionMatrix();

        this.composer.render();
        // this.stats.end();
      }

      // render other
      this.render();
      // this._renderer.render(this.scene, this._camera);
    });
  }

}


export default ThreeSceneBase