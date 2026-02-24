import type { Options as TileOptions } from "ol/layer/BaseTile";
import type { Options } from "ol/layer/WebGLTile";
import type TileSourceType from "ol/source/Tile";
import type ImageSourceType from "ol/source/Image";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF";
import type { Options as XYZOptions } from "ol/source/XYZ";
import type { Options as OSMOptions } from "ol/source/OSM";
import type { Options as ImageStaticOptions } from "ol/source/ImageStatic";
import type { Options as ImageTileOptions } from "ol/layer/BaseImage";
import BaseEvent from "ol/events/Event";
import { ObjectEvent } from "ol/Object";

export enum enumTile {
  TDT = "天地图",
  TDT_SATELLITE = "天地图-卫星影像",
  TDT_TERRAIN = "天地图-地形图",
  MAPBOX = "MAPBOX",
  BAIDU = "百度-矢量",
  BAIDU_SATELLITE = "百度-卫星影像",
  BAIDU_MIDNIGHT = "百度-午夜蓝",
  AMAP = "高德-矢量",
  AMAP_SATELLITE = "高德-卫星影像",
  GEOTIFF = "GEOTIFF",
  CUSTOMER = "CUSTOMER",
  XYZ = "XYZ",
  OSM = "OSM",
}

export declare type TileType = keyof typeof enumTile;

type TileLayerOptions = Omit<TileOptions<TileSourceType>, "source">;

export declare type TileGridOptions = import("ol/tilegrid/TileGrid").Options;

export declare type SourceXYZ = Omit<XYZOptions, "tileGrid">;

export interface SourceOptions extends Omit<import("ol/source/Tile").Options, "tileGrid">, SourceXYZ, OSMOptions {
  tileGrid?: TileGridOptions | undefined;
}

export interface BaseTileProps extends TileLayerOptions {
  tileType?: TileType;
  layerId?: string;
  source?: SourceOptions | undefined;
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

export type TileLayerEmitFnType = {
  (event: "sourceready", ...args: BaseEvent[]): void;
  (event: "change:visible", ...args: ObjectEvent[]): void;
};

type VectorTileLayer = Omit<import("ol/layer/VectorTile").Options, "source" | "style">;
export interface VectorTileOptions extends VectorTileLayer {
  layerId?: string;
  source?: import("ol/source/VectorTile").Options | undefined;
  layerStyle?: import("ol/layer/VectorTile").Options["style"];
}
