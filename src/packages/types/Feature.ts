import { Position, GeoJSON as Geo, Feature as GeoFeature, FeatureCollection as GeoFeatureCollection } from "geojson";

export declare type GeoJSON = Geo;
export declare type GeoJSONFeatureCollection = GeoFeatureCollection;
export declare type GeoJSONFeature = GeoFeature;

export declare type GeoCircle = {
  center: number[];
  radius: number | undefined;
};
export declare type GeoPoint = {
  coordinates: Position;
};
export declare type GeoMultiPoint = {
  coordinates: Position[] | Position;
};
export declare type GeoPolygon = {
  coordinates: Position[][] | Position;
};
export declare type GeoMultiPolygon = {
  coordinates: Position[][][] | Position;
};
export declare type GeoLineString = {
  coordinates: Position[] | Position;
};
export declare type GeoMultiLineString = {
  coordinates: Position[][] | Position;
};
export declare type GeoLinearRing = {
  coordinates: Position[] | Position;
};
export declare type GeoGeometryCollection = {
  geometries: (
    | GeoPoint
    | GeoMultiPoint
    | GeoCircle
    | GeoPolygon
    | GeoMultiPolygon
    | GeoLineString
    | GeoLinearRing
    | GeoMultiLineString
  )[];
};
export interface FeatureGeometry {
  type: import("ol/geom/Geometry").Type;
  geometry:
    | GeoPoint
    | GeoMultiPoint
    | GeoCircle
    | GeoPolygon
    | GeoMultiPolygon
    | GeoLineString
    | GeoMultiLineString
    | GeoLinearRing
    | GeoGeometryCollection;
  properties?: any;
}
export interface GeoJsonReadOptions {
  dataProjection?: import("ol/proj/Projection").Options;
  extent?: Array<number>;
  featureProjection?: import("ol/proj/Projection").Options;
}

declare const _default: import("vue").DefineComponent<
  {},
  {
    getLeaves: (
      clusterId: number,
      limit?: number,
      offset?: number,
    ) => Array<import("supercluster").PointFeature<import("supercluster").AnyProps>>;
  }
>;

// 为实例提供类型提示
export declare type OlFeatureInstance = InstanceType<typeof _default>;
