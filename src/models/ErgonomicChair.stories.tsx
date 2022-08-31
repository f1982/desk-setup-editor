import GUI from 'lil-gui';
import { useEffect } from 'react';
import { Scene } from 'three';
import ThreeAdapter from '../component/three/ThreeAdapter';
import ThreeSceneBase from '../component/three/ThreeSceneBase';
import ErgonomicChair from './ErgonomicChair';

export default {
  title: 'Models/ErgonomicChair',
  component: ErgonomicChair,
};

export const Demos = () => {
  useEffect(() => {

    return () => {
      console.log('unmount...')
    }
  }, []);

  const getScene = () => {
    const threeScene = new ThreeSceneBase();
    threeScene.initFun = (scene: Scene, gui: GUI) => {
      const desk = new ErgonomicChair();
      // desk.setGUI(gui);
      scene.add(desk);
    }
    return threeScene;
  }

  return (
    <div>
      <ThreeAdapter three={getScene()} />
    </div >
  )
};
