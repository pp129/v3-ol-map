import { createRouter, createWebHistory, RouteRecordRaw, RouteMeta } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {}
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "map",
    component: () => import("@/example/home/index.vue"),
  },
  {
    name: "vectorJson",
    path: "/vectorJson",
    component: () => import("@/example/vectorJson/index.vue"),
  },
  {
    name: "wfs",
    path: "/wfs",
    component: () => import("@/example/wfs/index.vue"),
  },
  {
    name: "wms",
    path: "/wms",
    component: () => import("@/example/wms/index.vue"),
  },
  {
    name: "heatmap",
    path: "/heatmap",
    component: () => import("@/example/heatmap/index.vue"),
  },
  {
    name: "cluster",
    path: "/cluster",
    component: () => import("@/example/cluster/index.vue"),
  },
  {
    name: "overview",
    path: "/overview",
    component: () => import("@/example/overview/index.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/example/test/index.vue"),
  },
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(),
  routes: routes,
});

export default router;
