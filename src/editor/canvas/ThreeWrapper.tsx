import React, { useEffect, useRef, useState } from 'react';
import ThreeCanvas from '../EditScene';
import BottomTools, { ButtonIds } from '../toolbars/BottomTools';
import LeftToolBar from '../toolbars/LeftToolBar';
import './ThreeWrapper.scss';


const ThreeWrapper: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeSceneRef = useRef<ThreeCanvas | null>(null);

  const startDrawing = (threeCanvas: ThreeCanvas) => {
    threeCanvas.setAnimationLoop(
      () => {
        threeCanvas.render();
      }
    );
  };

  useEffect(() => {
    if (!initialized) {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current;
        const threeScene = new ThreeCanvas({
          mountPoint: canvasRef.current,
          width: clientWidth,
          height: clientHeight,
        });
        threeSceneRef.current = threeScene;
        startDrawing(threeScene);
        setInitialized(true);
      }
    }
    // return () => {
    // if (threeSceneRef.current) {
    //   threeSceneRef.current.dispose();
    // }
    // if (canvasRef.current) {
    //   const child = canvasRef.current.firstChild;
    //   canvasRef.current.removeChild(child!);
    // } 
    // }
  }, [initialized]);

  const handleButtonClick = (buttonId: string) => {
    switch (buttonId) {
      case 'allObjects':
        threeSceneRef.current?.getAllObjects();
        break;
      case 'AddNewObj':
        threeSceneRef.current?.setupObjects.addRandomToRoom();
        break;
      case ButtonIds.Reset:
        threeSceneRef.current?.resetView();
        break;
      case ButtonIds.FocusRandom:
        threeSceneRef.current?.focusRandomObject();
        break;
      case ButtonIds.FocusMonitor:
        threeSceneRef.current?.focusChair();
        break;
      default:
        break;
    }
  }

  const handleLeftToolBarCallback = () => {
    console.log('handleLeftToolBarCallback');
  }
  
  return (
    <div className="container" data-test={initialized}>
      <div className="visualizationMount" ref={canvasRef} />
      <BottomTools callback={handleButtonClick} />
      <LeftToolBar callback={handleLeftToolBarCallback} />
    </div>
  );
};

export default ThreeWrapper;
