import React, { useEffect, useRef, useState } from 'react';
import ThreeCanvas from './ThreeCanvas';
import styles from './ThreeComponent.module.css';

const ThreeComp: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const startDrawing = (threeCanvas: ThreeCanvas) => {
    const renderLoop = () => {
      threeCanvas.render();
    };
    threeCanvas.setAnimationLoop(renderLoop);
  };

  // useEffect(() => {
  //   const init = () => {
  //     // @ts-ignore

  //     const canvas = new ThreeCanvas({
  //       mountPoint: canvasRef.current!,
  //       width: canvasRef.current?.clientWidth!,
  //       height: canvasRef.current?.clientHeight!,
  //     });
  //     startDrawing(canvas);
  //     setInitialized(true);
  //   };

  //   if (!initialized) {
  //     init();
  //   }
  // }, [initialized]);


  useEffect(() => {
    const canvas = new ThreeCanvas({
      mountPoint: canvasRef.current!,
      width: 500,
      height: 500,
    });
    startDrawing(canvas);
    setInitialized(true);

  }, []);

  return (
    <div className={styles.container} data-renderer={initialized}>
      <div className="visualizationMount" ref={canvasRef} />
    </div>
  );
};

export default ThreeComp;
