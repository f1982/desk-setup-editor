
import { saveAs } from 'file-saver';
import * as THREE from 'three'
import DSEObject from '../models/DSEObject';

function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
}

function getMovableMeshes(scene: THREE.Scene) {
  const objs = scene.children.filter((item: THREE.Object3D) => {
    return item instanceof DSEObject && item.name !== 'displayRoom'
  });
  const meshes: any[] = [];
  objs.forEach(element => {
    const elementMeshes = element.children.filter(item => (item instanceof THREE.Mesh));
    meshes.push(...elementMeshes);

    // get dse object list inside des object
    const subObjs = element.children.filter(item => (item instanceof DSEObject));
    console.log('subObjs', subObjs);
    subObjs.forEach(subObj=>{
      //meshes inside des
      const subMeshes = subObj.children.filter(subItem => (subItem instanceof THREE.Mesh));
      console.log('subMeshes', subMeshes);
      meshes.push(...subMeshes);
    })
    

  });
  return meshes;
}

// Use FileSaver.js 'saveAs' function to save the string
async function saveSTL(scene: THREE.Object3D, name: string) {
  const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter');
  // const { STLExporter } = await import('three-stdlib/exporters/STLExporter');
  const exporter = new STLExporter();
  const stlString = exporter.parse(scene, { binary: false });


  const blob = new Blob([stlString], { type: 'text/plain' });

  saveAs(blob, name + '.stl');
}

export {
  findType,
  saveSTL,
  getMovableMeshes
}
