import OlHeatmap from "../layers/heatmap/index.vue";
export interface HeatmapOptions extends Omit<import("ol/layer/Heatmap").Options, "source"> {
  layerId?: string;
  source?: import("ol/source/Vector").Options;
}

export declare type OlHeatmapInstance = InstanceType<typeof OlHeatmap>;
