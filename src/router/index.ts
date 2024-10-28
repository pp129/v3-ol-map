import { createRouter, createWebHistory, RouteRecordRaw, RouteMeta } from "vue-router";

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
    name: "vectorJson",
    path: "/vectorJson",
    component: () => import("@/example/vectorJson/index.vue"),
    meta: {
      title: "vectorLayer + Geojson",
      description: "矢量图层直接请求geojson格式数据并绘制",
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
  history: createWebHistory(),
  routes: routes,
});

export default router;
