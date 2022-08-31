import GUI from 'lil-gui';
import { useEffect } from 'react';
import { Scene } from 'three';
import ThreeAdapter from '../component/three/ThreeAdapter';
import ThreeSceneBase from '../component/three/ThreeSceneBase';
import SimpleDesk from './SimpleDesk';

export default {
  title: 'Models/Desk',
  component: SimpleDesk,
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
      const desk = new SimpleDesk();
      desk.setGUI(gui);
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
