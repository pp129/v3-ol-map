import type { App } from "vue";
import OlMap from "./map/index.vue";
import OlTile from "./layers/tile/index.vue";
import OlVector from "./layers/vector/index.vue";
import OlWfs from "./layers/wfs/index.vue";
import OlWms from "./layers/wms/index.vue";
import OlHeatmap from "./layers/heatmap/index.vue";
import OlFeature from "./feature";
import OlCluster from "./layers/cluster/index.vue";
import OlOverlay from "./overlay/index.vue";
import OlOverview from "./controls/OverviewMap.vue";

import * as utils from "./utils";

const components = [
  { name: "OlMap", component: OlMap },
  { name: "OlTile", component: OlTile },
  { name: "OlVector", component: OlVector },
  { name: "OlWfs", component: OlWfs },
  { name: "OlWms", component: OlWms },
  { name: "OlHeatmap", component: OlHeatmap },
  { name: "OlFeature", component: OlFeature },
  { name: "OlCluster", component: OlCluster },
  { name: "OlOverlay", component: OlOverlay },
  { name: "OlOverview", component: OlOverview },
];

export * from "./types/Map";
export * from "./types/Tile";
export * from "./types/Vector";
export * from "./types/WFS";
export * from "./types/Style";
export * from "./types/Heatmap";
export * from "./types/Feature";
export * from "./types/Cluster";
export * from "./types/Overlay";
export * from "./types/Overview";

export { utils, OlMap, OlTile, OlVector, OlWfs, OlWms, OlHeatmap, OlFeature, OlCluster, OlOverlay, OlOverview };

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
export interface installOptions {
  TDT?: TDT;
  Baidu?: Baidu;
  AMap?: AMap;
}

const defaultOptions: installOptions = {
  TDT: {
    ak: "",
    Normal: "https://t0.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=",
    Normal_Label: "https://t0.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=",
    Satellite: "https://t0.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=",
    Satellite_Label: "https://t0.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=",
    Terrain: "https://t0.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=",
    Terrain_Label: "https://t0.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=",
  },
  Baidu: {
    ak: "",
    Normal:
      "https://maponline1.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20220113&from=jsapi2_0",
    Satellite: "https://maponline3.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20240910",
    Satellite_Label: "https://maponline0.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=sl&udt=20240910",
    midnight:
      "http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20220819&scale=1&customid=midnight&ak=",
  },
  AMap: {
    Normal: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    Satellite: "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    Satellite_Label: "http://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
  },
};

const install = (app: App, options?: installOptions) => {
  components.forEach(component => {
    app.component(component.name, component.component);
  });
  if (options) {
    app.config.globalProperties.$OlMapConfig = options;
    app.provide("$OlMapConfig", {
      TDT: {
        ...defaultOptions.TDT,
        ...options.TDT,
      },
      Baidu: {
        ...defaultOptions.Baidu,
        ...options.Baidu,
      },
      AMap: {
        ...defaultOptions.AMap,
        ...options.AMap,
      },
    } as installOptions);
  }
};

export default {
  install,
};
