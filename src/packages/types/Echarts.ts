import OlEcharts from "../echarts/index.vue";
import { ProjectionLike } from "ol/proj";

declare type Nullable<T> = T | null;
declare type NoDef<T> = T | undefined;
interface OptionsTypes {
  source?: ProjectionLike;
  destination?: ProjectionLike;
  forcedRerender?: boolean;
  forcedPrecomposeRerender?: boolean;
  hideOnZooming?: boolean;
  hideOnMoving?: boolean;
  hideOnRotating?: boolean;
  convertTypes?: string[] | number[];
  insertFirst?: boolean;
  stopEvent?: boolean;
  polyfillEvents?: boolean;
  [key: string]: any;
}
export interface EchartsOptions {
  chartOptions?: NoDef<Nullable<object>>;
  options?: NoDef<Nullable<OptionsTypes>>;
  zIndex?: string | number | null;
  visible?: boolean;
}

export declare type OlEchartsInstance = InstanceType<typeof OlEcharts>;
