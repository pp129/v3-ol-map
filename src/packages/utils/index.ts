import { getCenter, getWidth, getHeight, getTopLeft, getTopRight } from "ol/extent.js";
import { Circle, Geometry, LineString, Polygon } from "ol/geom";
import Map from "ol/Map";
import { AnimationOptions } from "ol/View";
import { GeoJSON } from "ol/format";
import { ReadOptions } from "ol/format/Feature";
import {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeoJSONGeometry,
  GeoJSONGeometryCollection,
  Options,
} from "ol/format/GeoJSON";
import transform from "./transform";
import Feature from "ol/Feature";
import { ProjectionLike } from "ol/proj";

export const validObjKey = (obj: any, key: string): boolean => {
  if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
    // return !((typeof obj[key] === 'undefined') || (!obj[key] && obj[key] !== 0))
    if (typeof obj[key] === "object") {
      return Object.keys(obj[key]).length > 0;
    } else if (typeof obj[key] === "boolean") {
      return obj[key];
    } else {
      return true;
    }
  } else {
    return false;
  }
};

type GeoCenter = {
  center: import("ol/coordinate").Coordinate;
  coordinates: import("ol/coordinate").Coordinate[] | undefined;
  topCenter: import("ol/coordinate").Coordinate | undefined;
  minRadius: number;
  sqDistances: number[] | undefined;
};

export const calculateCenter = (geometry: Geometry | undefined): GeoCenter => {
  if (!geometry)
    return { center: [0, 0], coordinates: undefined, minRadius: 0, sqDistances: undefined, topCenter: [0, 0] };
  let center, coordinates, minRadius, topCenter;
  let topLat;
  if (getTopLeft((geometry as Polygon).getExtent())[1] >= getTopRight((geometry as Polygon).getExtent())[1]) {
    topLat = getTopLeft((geometry as Polygon).getExtent())[1];
  } else {
    topLat = getTopRight((geometry as Polygon).getExtent())[1];
  }
  let topCenterLongitude =
    (getTopLeft((geometry as Polygon).getExtent())[0] + getTopRight((geometry as Polygon).getExtent())[0]) / 2;
  topCenter = [topCenterLongitude, topLat];
  const type = geometry.getType();
  if (type === "Polygon") {
    let x = 0;
    let y = 0;
    let i = 0;
    coordinates = (geometry as Polygon).getCoordinates()[0].slice(1);
    coordinates.forEach(function (coordinate) {
      x += coordinate[0];
      y += coordinate[1];
      i++;
    });
    center = [x / i, y / i];
  } else if (type === "LineString") {
    center = (geometry as LineString).getCoordinateAt(0.5);
    coordinates = (geometry as LineString).getCoordinates();
  } else if (type === "Circle") {
    center = (geometry as Circle).getCenter();
  } else {
    center = getCenter(geometry.getExtent());
  }
  let sqDistances;
  if (coordinates) {
    sqDistances = coordinates.map(function (coordinate) {
      const dx = coordinate[0] - center[0];
      const dy = coordinate[1] - center[1];
      return dx * dx + dy * dy;
    });
    minRadius = Math.sqrt(Math.max.apply(Math, sqDistances)) / 3;
  } else {
    minRadius = Math.max(getWidth(geometry.getExtent()), getHeight(geometry.getExtent())) / 3;
  }
  return {
    center,
    coordinates,
    minRadius,
    sqDistances,
    topCenter,
  };
};

/**
 * 地图移动中心点
 * @param map
 * @param param
 */
export const panTo = (map: Map, param: AnimationOptions) => {
  map.getView().animate(param);
};

export interface flyAnimationOptions extends AnimationOptions {
  flyZoom?: number;
}
export const flyTo = (map: Map, param: flyAnimationOptions) => {
  const duration = param.duration || 2000;
  const view = map.getView();
  const zoom = param.zoom || view.getZoom() || 0;
  let parts = 2;
  let called = false;
  function callback() {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0) {
      called = true;
    }
  }
  view.animate(
    {
      center: param.center,
      duration,
    },
    callback,
  );
  view.animate(
    {
      zoom: param.flyZoom || zoom - 1,
      duration: duration / 2,
    },
    {
      zoom,
      duration: duration / 2,
    },
    callback,
  );
};

export const exportPNG = (map: Map, downloadName?: string): void => {
  map.once("rendercomplete", () => {
    const size = map.getSize();
    if (!size) return;

    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    const context = mapCanvas.getContext("2d");
    if (!context) return;

    map
      .getViewport()
      .querySelectorAll<HTMLCanvasElement>(".ol-layer canvas, canvas.ol-layer")
      .forEach(canvas => {
        if (canvas.width === 0) return;

        const parentStyle = canvas.parentElement?.style;
        const opacity = parentStyle?.opacity || canvas.style.opacity;
        context.globalAlpha = opacity ? Number(opacity) : 1;

        const matrix = canvas.style.transform
          .match(/^matrix\(([^)]*)\)$/)?.[1]
          .split(",")
          .map(Number);
        const scaleX = parseFloat(canvas.style.width) / canvas.width;
        const scaleY = parseFloat(canvas.style.height) / canvas.height;
        const transform = matrix || [
          Number.isFinite(scaleX) ? scaleX : 1,
          0,
          0,
          Number.isFinite(scaleY) ? scaleY : 1,
          0,
          0,
        ];
        context.setTransform(...(transform as [number, number, number, number, number, number]));

        if (parentStyle?.backgroundColor) {
          context.fillStyle = parentStyle.backgroundColor;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(canvas, 0, 0);
      });

    context.globalAlpha = 1;
    const link = document.createElement("a");
    const targetId = map.getTargetElement()?.id;
    const filename = downloadName || (targetId ? `map-export-${targetId}` : "map-export");
    link.download = filename.toLowerCase().endsWith(".png") ? filename : `${filename}.png`;
    link.href = mapCanvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  map.renderSync();
};

export interface ReadFeaturesOptions {
  source: ArrayBuffer | Document | Element | object | string;
  format?: Options;
  options?: ReadOptions;
}

export const readFeatures = (options: ReadFeaturesOptions) => {
  const format = new GeoJSON({ ...options.format });
  return format.readFeatures(options.source, { ...options.options });
};

export const readFeature = (options: ReadFeaturesOptions) => {
  const format = new GeoJSON({ ...options.format });
  return format.readFeature(options.source, { ...options.options });
};

export const readGeometry = (options: ReadFeaturesOptions): Geometry => {
  const format = new GeoJSON({ ...options.format });
  return format.readGeometry(options.source, { ...options.options });
};

type WriteOptions = {
  dataProjection?: ProjectionLike | undefined;
  featureProjection?: ProjectionLike | undefined;
  rightHanded?: boolean | undefined;
  decimals?: number | undefined;
};

/**
 * Encode an array of features as a GeoJSON object.
 */
export const writeFeaturesObject = (features: Feature[], options?: WriteOptions): GeoJSONFeatureCollection => {
  return new GeoJSON().writeFeaturesObject(features, options);
};

export const writeFeatureObject = (feature: Feature, options?: WriteOptions): GeoJSONFeature => {
  return new GeoJSON().writeFeatureObject(feature, options);
};

export const writeGeometryObject = (
  geometry: Geometry,
  options?: WriteOptions,
): GeoJSONGeometry | GeoJSONGeometryCollection => {
  return new GeoJSON().writeGeometryObject(geometry, options);
};

export { transform };
