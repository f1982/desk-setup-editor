import GUI from 'lil-gui';
import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import { GLTF, GLTFLoader, OBJLoader } from 'three-stdlib';
import DSEObject from './DSEObject';
import * as THREE from 'three'


class MonitorSample extends DSEObject {

  body: THREE.Group;

  mugWidth: number = 0.2

  constructor() {
    super();

    this.loadMonitor()
    this.layout();
  }

  /**
   * Get restrict min and max, will be used for object.position.clamp
   *  
   * @returns {min:Vector3, max: Vector3}
   */
  public getRestrictArea() {
    return {
      min: new Vector3(
        this.restrictMin.x + this.mugWidth / 2,
        this.restrictMin.y,
        this.restrictMin.z + this.mugWidth / 2,
      ),
      max: new Vector3(
        this.restrictMax.x - this.mugWidth / 2,
        this.restrictMax.y,
        this.restrictMax.z - this.mugWidth / 2,
      )
    }
  }

  private loadMonitor() {

    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new Mesh(geo, material);
    mesh.scale.set(1.2, 0.45, 0.1);

    this.add(mesh);

    const url = process.env.PUBLIC_URL + '/static/models/monitor-34.gltf';

    // Instantiate a loader
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      (gltf: GLTF) => {
        this.body = gltf.scene;
        console.log('this.body ', this.body);

        this.add(this.body);
      },
      // called while loading is progressing
      (xhr: ProgressEvent) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      // called when loading has errors
      (error) => {
        console.log('An error  happened');
      },
    );
  }



  private layout() {
    // this.body.scale.set(this.mugWidth, this.mugWidth, this.mugWidth)
  }
}


export default MonitorSample;