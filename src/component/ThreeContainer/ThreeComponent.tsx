import React, { useEffect, useRef, useState } from 'react';
import ThreeCanvas from '../ThreeCanvas';
import './ThreeComponent.scss';
import * as THREE from 'three'
import { saveSTL } from '../../utils/threeUtils';


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
      console.log('initialized');

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
