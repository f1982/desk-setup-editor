import Stats from 'stats.js';
import { AmbientLight, BoxGeometry, Clock, Color, DirectionalLight, Mesh, MeshLambertMaterial, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { EffectComposer, RenderPass } from 'three-stdlib';

export class ThreeSceneBase {
  protected clientWidth: number;
  protected clientHeight: number;
  protected mountPoint: HTMLDivElement;

  protected scene: Scene;
  protected renderer: WebGLRenderer;
  protected composer: EffectComposer;

  protected clock: Clock;
  protected camera: PerspectiveCamera;
  private stats: Stats;

  protected box: Mesh;

  protected _initFun: (scene: Scene) => void;

  set initFun(fun: (scene: Scene) => void) {
    this._initFun = fun
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
    this.clientWidth = width;
    this.clientWidth = height;
    this.mountPoint = mountPoint;

    this.initSetups();
    this.initObjects();

    this._initFun?.(this.scene);
  }

  initSetups() {
    const scene = new Scene();
    scene.background = new Color('#cccccc');
    this.scene = scene;

    const ambientLight = new AmbientLight(0xffffff, 0.66);
    ambientLight.position.set(0, 3, 0);
    scene.add(ambientLight);

    const directionLight = new DirectionalLight(0xffffff, 0.8);
    directionLight.position.set(13.5, 15, -12.5);
    scene.add(directionLight);

    const camera = new PerspectiveCamera(50, this.clientWidth / this.clientHeight, 0.1, 1000);
    // const camera = new OrthographicCamera(75, this.clientWidth / this.clientHeight, 0.1, 1000);
    camera.position.set(2, 1, -2);
    camera.lookAt(new Vector3(0, 0, 0));
    // camera.rotation.set(0, 0, 0)
    this.camera = camera;

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(this.clientWidth, this.clientHeight);
    this.renderer = renderer;

    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clear = false;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);

    // mount to DOM
    this.mountPoint.appendChild(this.renderer.domElement);

    const stats = new Stats();
    stats.showPanel(0);
    this.stats = stats;
  }

  protected initObjects() {
    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xffcc00 });
    const box = new Mesh(geo, material);
    this.scene.add(box);
    this.box = box;
  }

  public addObject(object: Object3D) {
    this.scene.add(object);
  }

  protected resizeRendererToDisplaySize() {
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

  protected render() {
    this.box.rotation.set(
      this.box.rotation.x + 0.01,
      this.box.rotation.y + 0.01,
      this.box.rotation.z + 0.01
    )
  };

  public dispose() {
    this.renderer.domElement.remove()
  };

  public startAnimationLoop() {
    this.renderer.setAnimationLoop(() => {
      // resize if it needs
      if (this.resizeRendererToDisplaySize()) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();

        this.composer.render();
        // this.stats.end();
      }

      // render other
      this.render();
    });
  }

}


export default ThreeSceneBase