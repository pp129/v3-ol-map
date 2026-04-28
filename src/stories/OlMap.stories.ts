import type { Meta, StoryObj } from "@storybook/vue3";
import { OlMap } from "v3-ol-map";
import ExampleMap from "../examples/map/index.vue";
import ExampleMapRaw from "../examples/map/index.vue?raw";
import { generateViewArgType } from "./utils/generateArgTypes";

const meta = {
  id: "1-2",
  title: "OlMap/Map",
  component: OlMap,
  tags: ["!dev"],
  argTypes: generateViewArgType(),
  render: args => ({
    components: { ExampleMap },
    template: `<example-map />`,
  }),
} satisfies Meta<typeof OlMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleMapRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleMap },
    template: `<example-map />`,
  }),
};
