import type { Meta, StoryObj } from "@storybook/vue3";
import { OlCluster } from "v3-ol-map";
import ExampleCluster from "../examples/cluster/index.vue";
import ExampleClusterRaw from "../examples/cluster/index.vue?raw";

const meta = {
  title: "OlMap/Cluster",
  component: OlCluster,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleCluster },
    template: "<example-cluster></example-cluster>",
  }),
} satisfies Meta<typeof OlCluster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleClusterRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleCluster },
    template: "<example-cluster></example-cluster>",
  }),
};
