import type { Meta, StoryObj } from "@storybook/vue3";
import { OlFeature } from "v3-ol-map";
import ExampleFeature from "../examples/featureStyle/index.vue";
import ExampleFeatureRaw from "../examples/featureStyle/index.vue?raw";
import ExampleFeatureGeoJson from "../examples/featureGeoJson/index.vue";
import ExampleFeatureGeoJsonRaw from "../examples/featureGeoJson/index.vue?raw";
import ExampleFeatureGeometries from "../examples/featureGeometries/index.vue";
import ExampleFeatureGeometriesRaw from "../examples/featureGeometries/index.vue?raw";

const meta = {
  title: "OlMap/Feature",
  component: OlFeature,
  tags: ["!dev"],
  render: args => ({
    components: { ExampleFeature },
    template: "<example-feature></example-feature>",
  }),
} satisfies Meta<typeof OlFeature>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleFeatureRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleFeature },
    template: "<example-feature></example-feature>",
  }),
};

export const GeoJson: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleFeatureGeoJsonRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleFeatureGeoJson },
    template: "<example-feature-geo-json></example-feature-geo-json>",
  }),
};

export const Geometries: Story = {
  parameters: {
    docs: {
      source: {
        code: ExampleFeatureGeometriesRaw,
      },
    },
  },
  render: args => ({
    components: { ExampleFeatureGeometries },
    template: "<example-feature-geometries></example-feature-geometries>",
  }),
};
