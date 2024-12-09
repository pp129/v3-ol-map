import OlMap from "./map/index.vue";
import OlTile from "./layers/tile/index.vue";
import OlImage from "./layers/image/index.vue";
import OlVector from "./layers/vector/index.vue";
import OlWfs from "./layers/wfs/index.vue";
import OlWms from "./layers/wms/index.vue";
import OlHeatmap from "./layers/heatmap/index.vue";
import OlTiff from "./layers/tiff/index.vue";
import OlFeature from "./feature/feature.ts";
import OlCluster from "./layers/cluster/index.vue";
import OlWind from "./layers/wind/index.vue";
import OlOverlay from "./overlay/index.vue";
import OlOverview from "./controls/OverviewMap/index.vue";
import OlDraw from "./interaction/draw/draw.ts";
import OlMeasure from "./interaction/measure/measure.ts";
import OlPath from "./path/path.ts";
import OlRoute from "./route/index.vue";
import OlEcharts from "./echarts/index.vue";
import OlConfig from "./config/index.vue";

export {
  OlMap,
  OlTile,
  OlImage,
  OlVector,
  OlWind,
  OlWfs,
  OlWms,
  OlHeatmap,
  OlTiff,
  OlFeature,
  OlCluster,
  OlOverlay,
  OlOverview,
  OlDraw,
  OlMeasure,
  OlPath,
  OlRoute,
  OlEcharts,
  OlConfig,
};

// GlobalComponents for Volar
declare module "vue" {
  export interface GlobalComponents {
    OlMap: typeof OlMap;
    OlTile: typeof OlTile;
    OlImage: typeof OlImage;
    OlVector: typeof OlVector;
    OlWind: typeof OlWind;
    OlWfs: typeof OlWfs;
    OlWms: typeof OlWms;
    OlHeatmap: typeof OlHeatmap;
    OlTiff: typeof OlTiff;
    OlFeature: typeof OlFeature;
    OlCluster: typeof OlCluster;
    OlOverlay: typeof OlOverlay;
    OlOverview: typeof OlOverview;
    OlDraw: typeof OlDraw;
    OlMeasure: typeof OlMeasure;
    OlPath: typeof OlPath;
    OlRoute: typeof OlRoute;
    OlEcharts: typeof OlEcharts;
    OlConfig: typeof OlConfig;
  }
}
