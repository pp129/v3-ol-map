import OlMap from "../map/index.vue";
import { ViewOptions } from "ol/View";

type defMapOptions = Omit<import("ol/Map").MapOptions, "controls" | "interactions" | "view" | "target">;

/**
 * 地图视图配置，继承自 ol/View 的 ViewOptions
 * @property {string} [city] - 城市名称
 * @property {[number, number]} [center] - 中心点坐标
 * @property {number} [zoom] - 缩放级别
 * @property {number} [minZoom] - 最小缩放级别
 * @property {number} [maxZoom] - 最大缩放级别
 * @property {number} [rotation] - 旋转角度（弧度）
 * @property {string|ProjectionLike} [projection] - 投影坐标系
 * @property {Extent} [extent] - 视图范围约束
 * @see https://openlayers.org/en/latest/apidoc/module-ol_View-ViewOptions.html
 */
export interface View extends ViewOptions {
  city?: string;
}

export declare type VMap = defMapOptions & {
  controls?: import("ol/control/defaults").DefaultsOptions;
  interactions?: import("ol/interaction/defaults").DefaultsOptions;
  view?: View;
  target?: string;
};

export declare type MapBrowserEvent = import("ol/MapBrowserEvent").default<any>;
export declare type ObjectEvent = import("ol/Object").ObjectEvent;
export declare type BaseEvent = import("ol/events/Event").default;

export declare type ExposeMap = {
  map: import("ol/Map").default;
  getMap: () => import("ol/Map").default;
  getLayerById: (id: string) => import("ol/layer/Base").default;
  panTo: (params: import("ol/View").AnimationOptions) => void;
};

export declare type OlMapInstance = InstanceType<typeof OlMap>;
