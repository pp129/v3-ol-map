import type { Preview } from "@storybook/vue3";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      /**
       * @param {import('@storybook/types').IndexEntry} a
       * @param {import('@storybook/types').IndexEntry} b
       */
      // @ts-expect-error TypeScript 无法识别 JSDoc 类型，但运行时需要无类型注解
      storySort: (a, b) => (a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })),
    },
  },
  decorators: [() => ({ template: '<div style="width: 100%;height: 60vh;"><story/></div>' })],
};

export default preview;
