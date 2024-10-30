import OlWfs from "../layers/wfs/index.vue";
import type { WriteGetFeatureOptions } from "ol/format/WFS";

export interface WFSOptions {
  options: WriteGetFeatureOptions;
}

export declare type OlWfsInstance = InstanceType<typeof OlWfs>;
