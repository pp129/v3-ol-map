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
    component: () => import("@/examples/home/index.vue"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/examples/map/index.vue"),
    meta: {
      title: "地图",
      description: "加载地图示例",
    },
  },
  {
    name: "tile",
    path: "/tile",
    component: () => import("@/examples/tile/index.vue"),
    meta: {
      title: "瓦片图层",
      description: "加载瓦片图层，图层切换示例",
    },
  },
  {
    name: "ocean",
    path: "/ocean",
    component: () => import("@/examples/ocean/index.vue"),
    meta: {
      title: "海图",
      description: "加载海图示例",
    },
  },
  {
    name: "vectorJson",
    path: "/vectorJson",
    component: () => import("@/examples/vectorJson/index.vue"),
    meta: {
      title: "vectorLayer + Geojson",
      description: "矢量图层直接请求geojson格式数据并绘制",
    },
  },
  {
    name: "vector",
    path: "/vector",
    component: () => import("@/examples/vector/index.vue"),
    meta: {
      title: "矢量图层+撒点+点击弹框",
      description: "矢量图层+撒点+点击弹框交互示例",
    },
  },
  {
    name: "webGLVector",
    path: "/webGLVector",
    component: () => import("@/examples/webGLVector/index.vue"),
    meta: {
      title: "WebGLVectorLayer",
      description: "基于WebGLVector渲染路况数据",
    },
  },
  {
    name: "vectorTile",
    path: "/vectorTile",
    component: () => import("@/examples/vectorTile/index.vue"),
    meta: {
      title: "vectorTile",
      description: "基于vectorTile渲染路况数据",
    },
  },
  {
    name: "featureStyle",
    path: "/featureStyle",
    component: () => import("@/examples/featureStyle/index.vue"),
    meta: {
      title: "自定义图标样式",
      description: "通过styleFunction动态显示",
    },
  },
  {
    name: "modifyFeature",
    path: "/modifyFeature",
    component: () => import("@/examples/modifyFeature/index.vue"),
    meta: {
      title: "可编辑要素",
      description: "可编辑要素示例",
    },
  },
  {
    name: "wfs",
    path: "/wfs",
    component: () => import("@/examples/wfs/index.vue"),
    meta: {
      title: "WFS",
      description: "WFS请求示例",
    },
  },
  {
    name: "wms",
    path: "/wms",
    component: () => import("@/examples/wms/index.vue"),
    meta: {
      title: "WMS",
      description: "加载WMS图层示例，渲染30w量级数据，耐心等待数据返回",
    },
  },
  {
    name: "heatmap",
    path: "/heatmap",
    component: () => import("@/examples/heatmap/index.vue"),
    meta: {
      title: "热力图",
      description: "热力图示例",
    },
  },
  {
    name: "tiff",
    path: "/tiff",
    component: () => import("@/examples/tiff/index.vue"),
    meta: {
      title: "TIFF",
      description: "加载TIFF图层示例",
    },
  },
  {
    name: "cluster",
    path: "/cluster",
    component: () => import("@/examples/cluster/index.vue"),
    meta: {
      title: "聚合",
      description: "用SuperCluster来实现聚合示例",
    },
  },
  {
    name: "controls",
    path: "/controls",
    component: () => import("@/examples/controls/index.vue"),
    meta: {
      title: "controls",
      description: "控制类示例集合",
    },
  },
  {
    name: "mousePosition",
    path: "/mousePosition",
    component: () => import("@/examples/mousePosition/index.vue"),
    meta: {
      title: "mousePosition",
      description: "鼠标移过位置经纬度",
    },
  },
  {
    name: "draw",
    path: "/draw",
    component: () => import("@/examples/draw/index.vue"),
    meta: {
      title: "绘制",
      description: "绘制示例",
    },
  },
  {
    name: "measure",
    path: "/measure",
    component: () => import("@/examples/measure/index.vue"),
    meta: {
      title: "测量",
      description: "测量示例",
    },
  },
  {
    name: "dragRotateAndZoom",
    path: "/dragRotateAndZoom",
    component: () => import("@/examples/dragRotateAndZoom/index.vue"),
    meta: {
      title: "拖拽旋转和缩放",
      description: "拖拽旋转和缩放",
    },
  },
  {
    name: "pin",
    path: "/pin",
    component: () => import("@/examples/pin/index.vue"),
    meta: {
      title: "标记/兴趣点/兴趣面",
      description: "标记示例",
    },
  },
  {
    name: "path",
    path: "/path",
    component: () => import("@/examples/path/index.vue"),
    meta: {
      title: "轨迹回放",
      description: "轨迹回放示例",
    },
  },
  {
    name: "route",
    path: "/route",
    component: () => import("@/examples/route/index.vue"),
    meta: {
      title: "路径规划",
      description: "路径规划示例，支持arcgis和graphhopper",
    },
  },
  {
    name: "echarts",
    path: "/echarts",
    component: () => import("@/examples/echarts/index.vue"),
    meta: {
      title: "echarts",
      description: "echarts示例，基于ol-echarts",
    },
  },
  {
    name: "wind",
    path: "/wind",
    component: () => import("@/examples/wind/index.vue"),
    meta: {
      title: "风场",
      description: "风场示例，基于ol-wind",
    },
  },
  {
    name: "config",
    path: "/config",
    component: () => import("@/examples/config/index.vue"),
    meta: {
      title: "配置项",
      description: "配置项示例",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/examples/test/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/multiMap",
    name: "multiMap",
    component: () => import("@/examples/multiMap/index.vue"),
    meta: {
      title: "多个地图",
      description: "多个地图",
    },
  },
  {
    path: "/groupLayer",
    name: "groupLayer",
    component: () => import("@/examples/groupLayer/index.vue"),
    meta: {
      title: "组合图层",
      description: "组合图层",
    },
  },
  {
    path: "/mask",
    name: "mask",
    component: () => import("@/examples/mask/index.vue"),
    meta: {
      title: "遮罩",
      description: "遮罩",
    },
  },
  {
    path: "/traffic",
    name: "traffic",
    component: () => import("@/examples/traffic/index.vue"),
    meta: {
      title: "交通层",
      description: "实时交通状况显示",
    },
  },
  {
    path: "/trafficWMS",
    name: "trafficWMS",
    component: () => import("@/examples/trafficWMS/index.vue"),
    meta: {
      title: "wms 路况图层",
      description: "实时交通状况显示",
    },
  },
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});

export default router;
