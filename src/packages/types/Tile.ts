import type { Options as TileOptions } from "ol/layer/BaseTile";
import type { Options } from "ol/layer/WebGLTile";
import type TileSourceType from "ol/source/Tile";
import type ImageSourceType from "ol/source/Image";
import type { Options as SourceOptions } from "ol/source/Tile";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF";
import type { Options as XYZOptions } from "ol/source/XYZ";
import type { Options as TileGridOptions } from "ol/tilegrid/TileGrid";
import type { Options as TileWMSOptions } from "ol/source/TileWMS";
import type { Options as ImageStaticOptions } from "ol/source/ImageStatic";
import type { Options as ImageTileOptions } from "ol/layer/BaseImage";
export enum enumTile {
  TDT = "TDT",
  TDT_SATELLITE = "TDT_SATELLITE",
  TDT_TERRAIN = "TDT_TERRAIN",
  MAPBOX = "MAPBOX",
  BAIDU = "BAIDU",
  BAIDU_SATELLITE = "BAIDU_SATELLITE",
  BAIDU_MIDNIGHT = "BAIDU_MIDNIGHT",
  AMAP = "AMAP",
  AMAP_SATELLITE = "AMAP_SATELLITE",
  GEOTIFF = "GEOTIFF",
  CUSTOMER = "CUSTOMER",
}

export type TileType = keyof typeof enumTile | string;

type TileLayer = Omit<TileOptions<TileSourceType>, "source">;

export interface BaseTileProps extends TileLayer {
  tileType?: TileType;
  layerId?: string;
  source?: SourceOptions | XYZOptions;
}

type WebGLTileLayer = Omit<Options, "source" | "style">;
export interface WebGLTileOptions extends WebGLTileLayer {
  source: GeoTIFFOptions;
  layerStyle?: Options["style"];
}

export type SourceWMS = Omit<TileWMSOptions, "tileGrid">;

export interface WMSOptions extends SourceWMS {
  tileGrid?: TileGridOptions;
}
type ImageLayer = Omit<ImageTileOptions<ImageSourceType>, "source">;
export interface ImageLayerOptions extends ImageLayer {
  source?: ImageStaticOptions;
}
