
import { MemoryRouter } from 'react-router-dom';
import LeftToolBar from './LeftToolBar';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Editor/LeftToolBar',
  component: LeftToolBar,
  decorators: [(Story) => (<MemoryRouter><Story /></MemoryRouter>)],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <LeftToolBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  callback: () => {
    // console.log('buttonId');
  }
};