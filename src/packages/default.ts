import type { ExtractPropTypes, InjectionKey, Ref } from "vue";
import type { App, Plugin } from "vue";
import OlMap from "./map/index.ts";
import OlTile from "./layers/tile/index.ts";
import OlImage from "./layers/image/index.ts";
import OlVector from "./layers/vector/index.ts";
import OlWebglVector from "./layers/WebGLVector/index.ts";
import OlWind from "./layers/wind/index.ts";
import OlWfs from "./layers/wfs/index.ts";
import OlWms from "./layers/wms/index.ts";
import OlHeatmap from "./layers/heatmap/index.ts";
import OlTiff from "./layers/tiff/index.ts";
import OlFeature from "./feature/index.ts";
import OlCluster from "./layers/cluster/index.ts";
import OlOverlay from "./overlay/index.ts";
import OlOverview from "./controls/OverviewMap/index.ts";
import OlZoomSlider from "./controls/ZoomSlider/index.ts";
import OlFullScreen from "./controls/FullScreen/index.ts";
import OlScaleLine from "./controls/ScaleLine/index.ts";
import OlMousePosition from "./controls/MousePosition/index.ts";
import OlDraw from "./interaction/draw/index.ts";
import OlMeasure from "./interaction/measure/index.ts";
import OlDragRotateAndZoom from "./interaction/DragRotateAndZoom/index.ts";
import OlPath from "./path/index.ts";
import OlRoute from "./route/index.ts";
import OlEcharts from "./echarts/index.ts";
import OlConfig from "./config/index.ts";
import { VMap } from "./types";

const components: Plugin[] = [
  OlMap,
  OlTile,
  OlImage,
  OlVector,
  OlWebglVector,
  OlWind,
  OlWfs,
  OlWms,
  OlHeatmap,
  OlTiff,
  OlFeature,
  OlCluster,
  OlOverlay,
  OlOverview,
  OlZoomSlider,
  OlFullScreen,
  OlScaleLine,
  OlMousePosition,
  OlDraw,
  OlMeasure,
  OlDragRotateAndZoom,
  OlPath,
  OlRoute,
  OlEcharts,
  OlConfig,
];

type TDT = {
  ak: string;
  Normal?: string;
  Normal_Label?: string;
  Satellite?: string;
  Satellite_Label?: string;
  Terrain?: string;
  Terrain_Label?: string;
};
type Baidu = {
  ak: string;
  Normal?: string;
  Satellite?: string;
  Satellite_Label?: string;
  midnight?: string;
};
type AMap = {
  Normal?: string;
  Satellite?: string;
  Satellite_Label?: string;
};
export declare const configProviderProps: {
  map: VMap;
  tdt: TDT;
  baidu: Baidu;
  amap: AMap;
};

export declare type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>;

const defaultOptions: ConfigProviderProps = {
  tdt: {
    ak: "",
    Normal: "https://t0.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=",
    Normal_Label: "https://t0.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=",
    Satellite: "https://t0.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=",
    Satellite_Label: "https://t0.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=",
    Terrain: "https://t0.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=",
    Terrain_Label: "https://t0.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=",
  },
  baidu: {
    ak: "",
    Normal:
      "https://maponline1.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20220113&from=jsapi2_0",
    Satellite: "https://maponline3.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20240910",
    Satellite_Label: "https://maponline0.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=sl&udt=20240910",
    midnight:
      "http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20220819&scale=1&customid=midnight&ak=",
  },
  amap: {
    Normal: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    Satellite: "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    Satellite_Label: "http://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
  },
};

export const defaultOlMapConfig = defaultOptions;

export type ConfigProviderContext = Partial<ConfigProviderProps>;

export const configProviderContextKey: InjectionKey<Ref<ConfigProviderProps>> = Symbol();

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    components.forEach(c => app.use(c));
    let config: ConfigProviderProps = defaultOptions;
    if (options) {
      app.config.globalProperties.$OlMapConfig = options;
      if (options.tdt) {
        config.tdt = {
          ...defaultOptions.tdt,
          ...options.tdt,
        };
      }
      if (options.baidu) {
        config.baidu = {
          ...defaultOptions.baidu,
          ...options.baidu,
        };
      }
      config.amap = {
        ...defaultOptions.amap,
        ...options.amap,
      };
      config.map = { ...options.map };
    }
    app.provide("$OlMapConfig", {
      map: config.map,
      TDT: config.tdt,
      Baidu: config.tdt,
      AMap: config.tdt,
    });
  };

  return {
    install,
  };
};

export default makeInstaller([...components]);
