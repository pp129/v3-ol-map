import { Options } from "ol-ext/filter/mask";
import OlMask from "../ext/mask/index.vue";
import { GeoJSON } from "../types";
import { Options as FillOptions } from "ol/style/Fill";

export declare type MaskOptions = Omit<Options, "feature" | "fill"> & {
  feature?: GeoJSON;
  fill: FillOptions;
};

export declare type OlMaskInstance = InstanceType<typeof OlMask>;
