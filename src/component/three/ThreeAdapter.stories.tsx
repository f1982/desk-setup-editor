import { BoxGeometry, Mesh, MeshLambertMaterial, Scene } from 'three';
import ThreeAdapter from './ThreeAdapter';
import ThreeSceneBase from './ThreeSceneBase';

export default {
  title: 'Experiment/ThreeAdapter',
  component: ThreeAdapter,
};

export const Demos = () => {
  const threeScene = new ThreeSceneBase();
  threeScene.initFun = (scene:Scene) => {
    const geo = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xff0000 });
    const box = new Mesh(geo, material);
    scene.add(box);
  }

  return (
    < div >
      <ThreeAdapter three={threeScene} />
    </div >
  )
};
