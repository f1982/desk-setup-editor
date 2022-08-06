
import { saveAs } from 'file-saver';
import * as THREE from 'three'

function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
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
  saveSTL
}
