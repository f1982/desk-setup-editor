import React, { useEffect, useRef, useState } from 'react';
import ThreeCanvas from '../ThreeCanvas';
import './ThreeComponent.scss';

const ThreeComp: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const startDrawing = (threeCanvas: ThreeCanvas) => {
    threeCanvas.setAnimationLoop(
      () => {
        threeCanvas.render();
      }
    );
  };

  useEffect(() => {
    console.log('useEffect');
    
    if (!initialized) {
      console.log('initialized');

      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current;
        const canvas = new ThreeCanvas({
          mountPoint: canvasRef.current,
          width: clientWidth,
          height: clientHeight,
        });

        startDrawing(canvas);
        setInitialized(true);
      }
    }
  }, []);

  return (
    <div className="container" data-test={initialized}>
      <div className="visualizationMount" ref={canvasRef} />
    </div>
  );
};

export default ThreeComp;
