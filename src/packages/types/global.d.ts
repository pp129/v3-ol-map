declare module "vue" {
  export interface GlobalComponents {
    OlMap: (typeof import("../map/index.vue"))["default"];
    OlTile: (typeof import("../layers/tile/index.vue"))["default"];
    OlVector: (typeof import("../layers/vector/index.vue"))["default"];
    OlWfs: (typeof import("../layers/wfs/index.vue"))["default"];
    OlWms: (typeof import("../layers/wms/index.vue"))["default"];
    OlHeatmap: (typeof import("../layers/heatmap/index.vue"))["default"];
    OlFeature: (typeof import("../feature/index"))["default"];
    OlCluster: (typeof import("../layers/cluster/index.vue"))["default"];
    OlOverlay: (typeof import("../overlay/index.vue"))["default"];
    OlOverview: (typeof import("../controls/OverviewMap.vue"))["default"];
  }
}

export {};
