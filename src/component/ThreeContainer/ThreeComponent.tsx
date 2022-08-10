import React, { useEffect, useRef, useState } from 'react';
import { saveSTL } from '../../utils/threeUtils';
import ThreeCanvas from '../../editor/EditScene';
import './ThreeComponent.scss';


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
    return ()=>{
      if (threeSceneRef.current){
        threeSceneRef.current.dispose();
      }
      if (canvasRef.current){
        const child = canvasRef.current.firstChild;
        canvasRef.current.removeChild(child!);
      }
    }
  }, []);

  return (
    <div className="container" data-test={initialized}>
      <div className="visualizationMount" ref={canvasRef} />
      <div>
        <button onClick={() => {
          if (threeSceneRef.current && threeSceneRef.current.scene) {
            saveSTL(threeSceneRef.current.scene, 'test-stl-file')
          }
        }}>Save STL</button>
      </div>
    </div>
  );
};

export default ThreeComp;
