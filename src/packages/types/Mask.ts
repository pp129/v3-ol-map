import { Options } from "ol-ext/filter/mask";
import OlMask from "../ext/mask/index.vue";
import { GeoJSON } from "../types";

export declare type MaskOptions = Omit<Options, "feature"> & {
  feature?: GeoJSON;
};

export declare type OlMaskInstance = InstanceType<typeof OlMask>;
