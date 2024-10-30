import type { Options as TileOptions } from "ol/layer/BaseTile";
import type { Options } from "ol/layer/WebGLTile";
import type TileSourceType from "ol/source/Tile";
import type ImageSourceType from "ol/source/Image";
import type { Options as SourceOptions } from "ol/source/Tile";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF";
import type { Options as XYZOptions } from "ol/source/XYZ";
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

export declare type TileType = keyof typeof enumTile;

type TileLayer = Omit<TileOptions<TileSourceType>, "source">;

export interface BaseTileProps extends TileLayer {
  tileType?: TileType;
  layerId?: string;
  source?: SourceOptions | XYZOptions;
}

export declare type BaseTileSourceOptions = BaseTileProps["source"];

export declare type BaseTileOptions = BaseTileProps;

type WebGLTileLayer = Omit<Options, "source" | "style">;
export interface WebGLTileOptions extends WebGLTileLayer {
  source: GeoTIFFOptions;
  layerStyle?: Options["style"];
}

type ImageLayer = Omit<ImageTileOptions<ImageSourceType>, "source">;
export interface ImageLayerOptions extends ImageLayer {
  source?: ImageStaticOptions | undefined;
}
