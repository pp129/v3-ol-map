import OlWms from "../layers/wms/index.vue";
import type { Options as TileWMSOptions } from "ol/source/TileWMS";
import type { Options as ImageWMSOptions } from "ol/source/ImageWMS";
import type { Options as TileGridOptions } from "ol/tilegrid/TileGrid";
export type SourceTileWMS = Omit<TileWMSOptions, "tileGrid">;
export type SourceImageWMS = Omit<ImageWMSOptions, "tileGrid" | "params">;
export interface SourceTileWMSOptions extends SourceTileWMS {
  tileGrid?: TileGridOptions;
}
export interface SourceImageWMSOptions extends SourceImageWMS {
  tileGrid?: TileGridOptions;
  params: SourceTileWMS["params"];
}
export declare type WMSOptions = SourceTileWMSOptions | SourceImageWMSOptions;

export declare type OlWmsInstance = InstanceType<typeof OlWms>;
