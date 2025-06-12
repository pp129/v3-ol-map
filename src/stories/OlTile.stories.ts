import type { Meta, StoryObj } from "@storybook/vue3";
import OlMap from "@/packages/map/index.vue";

const meta = {
  title: "OlMap/Map",
  component: OlMap,
  tags: ["autodocs"],
  render: args => ({
    components: { OlMap },
    setup() {
      return { args };
    },
    template: `<ol-map v-bind="args" />`,
  }),
} satisfies Meta<typeof OlMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
