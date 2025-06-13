import { IOptions, IField } from "wind-core";
import { Options as LayerOptions } from "ol/layer/Vector";
import OlWind from "../layers/wind/index.vue";
import MapBrowserEvent from "ol/MapBrowserEvent";

type defaultVectorOptions = Omit<LayerOptions, "source" | "style">;

export declare type WindOptions = Partial<IOptions>;
export declare type FieldOptions = Partial<IField>;
export declare type WindLayer = import("ol-wind").WindLayer;

export declare type WindData = {
  u: number;
  v: number;
  m: number;
  directionTo: number;
  directionFrom: number;
  windLevel: string;
  windDirection: string | undefined;
} | null;
export declare interface WindLayerEvent extends MapBrowserEvent {
  data: WindData;
}

export interface WindLayerOptions extends defaultVectorOptions {
  /**
   * 图层id
   */
  layerId?: string;
  /**
   * 风场数据
   */
  data: any;
  /**
   * 配置是否强制渲染；ol 对图层有一定的优化策略，在地图拖动，缩放等交互会隐藏图层，如果我们期望在拖动缩放
   * 也需要保持图层显示，那么可以开启器配置（默认开启）
   */
  forceRender?: boolean;
  /**
   * 风场渲染相关配置
   */
  windOptions?: WindOptions;
  /**
   * 风场数据相关配置
   */
  fieldOptions?: FieldOptions;
}

export declare type OlWindInstance = InstanceType<typeof OlWind>;
