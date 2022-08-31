import React, { useEffect, useRef } from 'react';
import ThreeSceneBase from './ThreeSceneBase';

interface ThreeAdapterProps {
  three: ThreeSceneBase
}

const ThreeAdapter: React.FC<ThreeAdapterProps> = ({ three }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const { clientWidth, clientHeight } = canvasRef.current;
      three.init({
        mountPoint: canvasRef.current,
        width: clientWidth,
        height: clientHeight,
      })

      three.startAnimationLoop();
      return () => {
        three.dispose();
      }
    }
  });

  return (
    <div className="container" ref={canvasRef} />
  );
};

export default ThreeAdapter;
