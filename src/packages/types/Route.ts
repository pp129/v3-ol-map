import OlRoute from "../route/index.vue";
import type { Feature, FeatureCollection, LineString, Point, Position } from "geojson";
import type { FeatureStyle, VectorLayerOptions } from "../types";

type spatialReference = {
  wkid?: number | string;
  latestWkid?: number | string;
  vcsWkid?: number | string;
  latestVcsWkid?: number | string;
};

type GeometryJson = {
  paths?: [number, number][][];
  rings?: [number, number][][];
};

type FeatureJson<T extends "rings" | "paths"> = {
  geometry: {
    spatialReference?: spatialReference;
    (arg: T): GeometryJson[T];
    attributes?: Record<string, any>;
  };
};

type FeaturesJson<T extends "rings" | "paths"> = {
  type: "features";
  hasZ?: boolean;
  features?: FeatureJson<T>[];
};
type AttributeParameterValues = {
  attributeName?: string;
  parameterName?: string;
  value?: string;
};

export declare type ArcgisRouteQueryParams = {
  /**
   * 输出格式.
   */
  f?: "html" | "json" | "pjson";
  /**
   * 在分析过程中，该组站点被加载为网络位置
   *
   * Syntax: stops=x1,y1; x2, y2; ...; xn, yn
   *
   * Example: stops=-122.4079, 37.78356; -122.404, 37.782
   */
  stops: string;
  /**
   * 在分析过程中作为网络位置加载的障碍物集
   */
  barriers?: string;
  /**
   * 在分析过程中加载为网络位置的折线屏障集
   */
  polylineBarriers?: FeaturesJson<"paths">;
  polygonBarriers?: FeaturesJson<"rings">;
  /**
   * 可以参数化以确定车辆可以使用哪些网络元素。
   */
  attributeParameterValues?: AttributeParameterValues;
  /**
   * 如果为true，将生成方向并与分析结果一起返回。默认值为true。
   */
  returnDirections?: boolean;
  directionsLanguage?: string;
  directionsLengthUnits?:
    | "esriNAUFeet"
    | "esriNAUKilometers"
    | "esriNAUMeters"
    | "esriNAUMiles"
    | "esriNAUNauticalMiles"
    | "esriNAUYards";
  /**
   * 如果为true，则路线将与分析结果一起返回。默认值为true。
   */
  returnRoutes?: boolean;
  returnStops?: boolean;
  returnZ?: boolean;
};
export declare type Methods = "POST" | "post" | "GET" | "get";
/**
 * GET
 * Example: point=51.131,12.414&point=48.224,3.867
 * POST
 * Example: points: [ [A_longitude, A_latitude], [B_longitude, B_latitude], [C_longitude, C_latitude]]
 */
type GraphhopperPoint<M extends Methods> = M extends "POST" | "post" ? { points: Position[] } : { point: string };

export declare type GraphhopperRouteQueryParams<M extends Methods> =
  {
    profile?: string;
    locale?: string;
    optimize?: "true" | "false";
    points_encoded?: boolean;
  } extends GraphhopperPoint<M>
    ? GraphhopperPoint<M>
    : {};

export declare type Type = "arcgis" | "graphhopper";
export declare type Params<T extends Type, M extends Methods> = T extends "arcgis"
  ? ArcgisRouteQueryParams
  : GraphhopperRouteQueryParams<M>;

export declare type RouteProps = {
  type?: Type;
  url?: string;
  method?: "post" | "get" | "POST" | "GET";
  params?: Omit<Params<Type, Methods>, "stops">;
};
export interface StopPoint {
  index: number;
  name?: string;
  coordinate: number[];
}
export interface RouteOptions extends VectorLayerOptions, RouteProps {
  arrow?: number | undefined;
  startStyle?: FeatureStyle;
  endStyle?: FeatureStyle;
  lineStyle?: FeatureStyle;
  stopsStyle?: FeatureStyle;
}

export declare type RouteFeatureJson = undefined | Feature<Point | LineString> | FeatureCollection;

export declare type OlRouteInstance = InstanceType<typeof OlRoute>;
