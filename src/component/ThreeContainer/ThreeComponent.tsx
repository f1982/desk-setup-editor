import React, { useEffect, useRef, useState } from 'react';
import { saveSTL } from '../../utils/threeUtils';
import ThreeCanvas from '../../editor/EditScene';
import './ThreeComponent.scss';
import BottomTools, { ButtonIds } from '../../editor/toolbars/BottomTools';


const ThreeComp: React.FC = () => {
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
    return () => {
      if (threeSceneRef.current) {
        threeSceneRef.current.dispose();
      }
      if (canvasRef.current) {
        const child = canvasRef.current.firstChild;
        canvasRef.current.removeChild(child!);
      }
    }
  }, []);

  const handleButtonClick = (buttonId: string) => {
    switch (buttonId) {
      case ButtonIds.Reset:
        threeSceneRef.current?.resetView();
        break;
      case ButtonIds.FocusDesk:
        threeSceneRef.current?.focusObject();
        break;
      case ButtonIds.FocusMonitor:
        threeSceneRef.current?.focusChair();
        break;
      default:
        break;
    }
  }

  return (
    <div className="container" data-test={initialized}>
      <div className="visualizationMount" ref={canvasRef} />
      <BottomTools callback={handleButtonClick} />
    </div>
  );
};

export default ThreeComp;
