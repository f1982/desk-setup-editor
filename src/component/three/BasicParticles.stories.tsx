import BasicParticle from './BasicParticles';
import ThreeAdapter from './ThreeAdapter';

export default {
  title: 'Experiment/BasicParticles',
  component: ThreeAdapter,
};

export const Demos = () => {
  const getScene = () => {
    const threeScene = new BasicParticle();

    return threeScene;
  }

  return (
    < div >
      <ThreeAdapter three={getScene()} />
    </div >
  )
};
