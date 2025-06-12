import type { Preview } from '@storybook/vue3'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 100%;height: 60vh;"><story/></div>' })],
};

export default preview;
