import type { Meta, StoryObj } from "@storybook/vue3";
import { OlMap, OlTile } from "@/packages";
import SwitchTile from "../examples/tile/index.vue";
import SwitchTileRaw from "../examples/tile/index.vue?raw";
import TileXYZ from "../examples/tileXYZ/index.vue";
import TileXYZRaw from "../examples/tileXYZ/index.vue?raw";

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
  parameters: {
    docs: {
      source: {
        code: TileXYZRaw,
      },
    },
  },
  render: args => ({
    components: { TileXYZ },
    setup() {
      return {};
    },
    template: `
        <tile-XYZ></tile-XYZ>
    `,
  }),
};

export const Switch: Story = {
  parameters: {
    docs: {
      source: {
        code: SwitchTileRaw,
      },
    },
  },
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
