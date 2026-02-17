import type { Meta, StoryObj } from "@storybook/vue3";
import { OlConfig } from "v3-ol-map";
import ExampleConfig from "../examples/config/index.vue";
import ExampleConfigRaw from "../examples/config/index.vue?raw";

const meta = {
  title: "OlMap/Config",
  component: OlConfig,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleConfig },
    template: "<example-config></example-config>",
  }),
} satisfies Meta<typeof OlConfig>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleConfigRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleConfig },
    template: "<example-config></example-config>",
  }),
};
