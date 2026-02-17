import type { Meta, StoryObj } from "@storybook/vue3";
import { OlOverlay } from "v3-ol-map";
import ExampleOverlay from "../examples/overlay/index.vue";
import ExampleOverlayRaw from "../examples/overlay/index.vue?raw";

const meta = {
  title: "OlMap/Overlay",
  component: OlOverlay,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleOverlay },
    template: "<example-overlay></example-overlay>",
  }),
} satisfies Meta<typeof OlOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleOverlayRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleOverlay },
    template: "<example-overlay></example-overlay>",
  }),
};
