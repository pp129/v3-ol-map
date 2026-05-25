import type { Meta, StoryObj } from "@storybook/vue3";
import { OlImage } from "v3-ol-map";
import ExampleWms from "../examples/wms/index.vue";
import ExampleWmsRaw from "../examples/wms/index.vue?raw";
import ExampleTrafficWms from "../examples/trafficWMS/index.vue";
import ExampleTrafficWmsRaw from "../examples/trafficWMS/index.vue?raw";

const meta = {
  id: "1-7",
  title: "OlMap/Image",
  component: OlImage,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleWms },
    template: "<example-wms></example-wms>",
  }),
} satisfies Meta<typeof OlImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleWmsRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleWms },
    template: "<example-wms></example-wms>",
  }),
};

export const TrafficWms: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleTrafficWmsRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleTrafficWms },
    template: "<example-traffic-wms></example-traffic-wms>",
  }),
};
