import { BoxGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three-stdlib';
import DSEObject from './DSEObject';

class Chair extends DSEObject {

  body: Mesh;

  mugWidth = 0.4
  chairHeight = 0.6;

  constructor() {
    super();

    this.loadGLTF()
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
        0,
        this.restrictMin.z + this.mugWidth / 2,
      ),
      max: new Vector3(
        this.restrictMax.x - this.mugWidth / 2,
        0,
        this.restrictMax.z - this.mugWidth / 2,
      )
    }
  }

  private loadGLTF() {

    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xff0000, wireframe: true });
    const mesh = new Mesh(geo, material);
    mesh.scale.set(1.2, 0.45, 0.1);

    this.add(mesh);

    const url = process.env.PUBLIC_URL + '/static/models/chair.gltf';

    // Instantiate a loader
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
      // resource URL
      url,
      // called when the resource is loaded
      (gltf: GLTF) => {

        this.add(gltf.scene);
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
    // this.body.scale.set(this.mugWidth, this.chairHeight, this.mugWidth);
    // this.body.position.set(0, this.chairHeight/2, 0);
  }
}

export default Chair;