
import { saveAs } from 'file-saver';
import * as THREE from 'three'
import { STLExporter } from 'three-stdlib';
function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
}

// Use FileSaver.js 'saveAs' function to save the string
function saveSTL(scene: THREE.Scene, name: string) {
  const exporter = new STLExporter();
  const stlString = exporter.parse(scene, { binary: true });

  const blob = new Blob([stlString], { type: 'text/plain' });

  saveAs(blob, name + '.stl');
}

export {
  findType,
  saveSTL
}
