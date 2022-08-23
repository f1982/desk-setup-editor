import gsap from 'gsap';
import { Box3, BoxGeometry, Mesh, MeshLambertMaterial, Object3D, Vector3 } from 'three';

const Y_GAP = 0.2;

class SelectedIndicator extends Object3D {

  protected _indicator: Mesh;
  protected _gsap: GSAPTween;


  constructor() {
    super();

    this.init();
  }

  public show() {
    // const bbox = new Box3().setFromObject(this);
    this.add(this._indicator);
    // this._indicator.position.set(0, bbox.max.y, 0);

    this._gsap.play();
  }

  /**
   * Move indicator to a specific object in the room
   */
  public moveTo(obj: Object3D) {
    const wp = obj.getWorldPosition(new Vector3(0, 0, 0));
    // get object bbox
    const bbox = new Box3().setFromObject(obj);
    // console.log('bbox max: ', bbox);
    // move the indicator to top of the obj
    // wp.add(new Vector3(0, bbox.max.y + Y_GAP, 0));
    // this.position.copy(wp);
    this.position.set(wp.x, bbox.max.y + Y_GAP, wp.z);
  }

  public hide() {
    this._gsap.pause();
    this.remove(this._indicator);
  }

  protected init() {
    const geo = new BoxGeometry(0.1, 0.1, 0.1);
    const material = new MeshLambertMaterial({ color: 0xff0000 });
    this._indicator = new Mesh(geo, material);
    this._indicator.position.set(0, 0, 0);
    this._gsap = gsap.to(this._indicator.rotation, { duration: 1, y: Math.PI * 2, repeat: -1, ease: "none" });
    this._gsap.pause();
  }
}

export default SelectedIndicator