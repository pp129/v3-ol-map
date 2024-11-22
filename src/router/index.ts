import { createRouter, RouteRecordRaw, RouteMeta, createWebHashHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    description?: string;
    hidden?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    name: "home",
    path: "/",
    component: () => import("@/example/home/index.vue"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/example/map/index.vue"),
    meta: {
      title: "地图",
      description: "加载地图示例",
    },
  },
  {
    name: "tile",
    path: "/tile",
    component: () => import("@/example/tile/index.vue"),
    meta: {
      title: "瓦片图层",
      description: "加载瓦片图层，图层切换示例",
    },
  },
  {
    name: "ocean",
    path: "/ocean",
    component: () => import("@/example/ocean/index.vue"),
    meta: {
      title: "海图",
      description: "加载海图示例",
    },
  },
  {
    name: "vectorJson",
    path: "/vectorJson",
    component: () => import("@/example/vectorJson/index.vue"),
    meta: {
      title: "vectorLayer + Geojson",
      description: "矢量图层直接请求geojson格式数据并绘制",
    },
  },
  {
    name: "vector",
    path: "/vector",
    component: () => import("@/example/vector/index.vue"),
    meta: {
      title: "矢量图层+撒点+点击弹框",
      description: "矢量图层+撒点+点击弹框交互示例",
    },
  },
  {
    name: "featureStyle",
    path: "/featureStyle",
    component: () => import("@/example/featureStyle/index.vue"),
    meta: {
      title: "自定义图标样式",
      description: "通过styleFunction动态显示",
    },
  },
  {
    name: "modifyFeature",
    path: "/modifyFeature",
    component: () => import("@/example/modifyFeature/index.vue"),
    meta: {
      title: "可编辑要素",
      description: "可编辑要素示例",
    },
  },
  {
    name: "wfs",
    path: "/wfs",
    component: () => import("@/example/wfs/index.vue"),
    meta: {
      title: "WFS",
      description: "WFS请求示例",
    },
  },
  {
    name: "wms",
    path: "/wms",
    component: () => import("@/example/wms/index.vue"),
    meta: {
      title: "WMS",
      description: "加载WMS图层示例，渲染30w量级数据，耐心等待数据返回",
    },
  },
  {
    name: "heatmap",
    path: "/heatmap",
    component: () => import("@/example/heatmap/index.vue"),
    meta: {
      title: "热力图",
      description: "热力图示例",
    },
  },
  {
    name: "tiff",
    path: "/tiff",
    component: () => import("@/example/tiff/index.vue"),
    meta: {
      title: "TIFF",
      description: "加载TIFF图层示例",
    },
  },
  {
    name: "cluster",
    path: "/cluster",
    component: () => import("@/example/cluster/index.vue"),
    meta: {
      title: "聚合",
      description: "用SuperCluster来实现聚合示例",
    },
  },
  {
    name: "overview",
    path: "/overview",
    component: () => import("@/example/overview/index.vue"),
    meta: {
      title: "鹰眼",
      description: "鹰眼示例",
    },
  },
  {
    name: "draw",
    path: "/draw",
    component: () => import("@/example/draw/index.vue"),
    meta: {
      title: "绘制",
      description: "绘制示例",
    },
  },
  {
    name: "measure",
    path: "/measure",
    component: () => import("@/example/measure/index.vue"),
    meta: {
      title: "测量",
      description: "测量示例",
    },
  },
  {
    name: "pin",
    path: "/pin",
    component: () => import("@/example/pin/index.vue"),
    meta: {
      title: "标记/兴趣点/兴趣面",
      description: "标记示例",
    },
  },
  {
    name: "path",
    path: "/path",
    component: () => import("@/example/path/index.vue"),
    meta: {
      title: "轨迹回放",
      description: "轨迹回放示例",
    },
  },
  {
    name: "route",
    path: "/route",
    component: () => import("@/example/route/index.vue"),
    meta: {
      title: "路径规划",
      description: "路径规划示例，支持arcgis和graphhopper",
    },
  },
  {
    name: "echarts",
    path: "/echarts",
    component: () => import("@/example/echarts/index.vue"),
    meta: {
      title: "echarts",
      description: "echarts示例，基于ol-echarts",
    },
  },
  {
    name: "wind",
    path: "/wind",
    component: () => import("@/example/wind/index.vue"),
    meta: {
      title: "风场",
      description: "风场示例，基于ol-wind",
    },
  },
  {
    name: "config",
    path: "/config",
    component: () => import("@/example/config/index.vue"),
    meta: {
      title: "配置项",
      description: "配置项示例",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/example/test/index.vue"),
    meta: {
      hidden: true,
    },
  },
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});

export default router;
