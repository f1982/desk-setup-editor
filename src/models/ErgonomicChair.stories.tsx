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
  const getScene = () => {
    const threeScene = new ThreeSceneBase();
    
    // add additional objects after scene created
    threeScene.addObject = (scene: Scene, gui: GUI) => {
      const desk = new ErgonomicChair();
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
