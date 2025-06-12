import type { Meta, StoryObj } from "@storybook/vue3";
import { OlMap, OlTile } from "@/packages";
import SwitchTile from "../examples/tile/index.vue";

const meta = {
  title: "OlMap/Tile",
  component: OlTile,
  tags: ["!dev"],
  render: args => ({
    components: { OlMap, OlTile },
    setup() {
      const source = args.source;
      const tileType = args.tileType;
      return {
        source,
        tileType,
      };
    },
    template: `
        <ol-map>
          <ol-tile :tile-type="tileType" :source="source"></ol-tile>
        </ol-map>
    `,
  }),
} satisfies Meta<typeof OlTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tileType: "AMAP",
  },
};

export const XYZ: Story = {
  args: {
    tileType: "XYZ",
    source: {
      url: "http://172.16.34.120:6080/arcgis/rest/services/xiamen/MapServer/tile/{z}/{y}/{x}",
      projection: "EPSG:4490",
      crossOrigin: "anonymous",
    },
  },
};

export const Switch: Story = {
  render: args => ({
    components: { SwitchTile },
    setup() {
      return {};
    },
    template: `
        <switch-tile></switch-tile>
    `,
  }),
};
