import type { Meta, StoryObj } from "@storybook/vue3";
import { OlVector } from "v3-ol-map";
import ExampleVector from "../examples/vector/index.vue";
import ExampleVectorRaw from "../examples/vector/index.vue?raw";

const meta = {
  title: "OlMap/Vector",
  component: OlVector,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleVector },
    template: "<example-vector></example-vector>",
  }),
} satisfies Meta<typeof OlVector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleVectorRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleVector },
    template: "<example-vector></example-vector>",
  }),
};
