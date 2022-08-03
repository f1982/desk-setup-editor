
function findType(scene: THREE.Group, type: string, name: string) {
  return scene.children.find((child) => (child.type === type && child.name === name));
}

export {
  findType
}