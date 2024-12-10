import { defineConfig } from "vitepress";
import crypto from "node:crypto";
import { Worker } from "node:worker_threads";
// https://vitepress.dev/reference/site-config
export default defineConfig(()=> {
  globalThis.Worker ??= Worker;
  globalThis.crypto ??= crypto;

  return {
    base: "/",
    lang: "zh-CN",
    title: "v3-ol-map",
    description: "vue3+openLayers组件",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "Home", link: "/" },
        { text: "Examples", link: "/markdown-examples" },
        { text: "API", link: "/api-examples" },
      ],
      sidebar: [
        {
          text: "Examples",
          items: [
            { text: "配置项", link: "/ol-config" },
            { text: "地图", link: "/ol-map" },
            { text: "鹰眼图", link: "/ol-overview" },
            {
              text: "图层",
              items: [
                { text: "栅格图层", link: "/ol-tile" },
                { text: "矢量图层", link: "/ol-vector" },
                { text: "WFS图层", link: "/ol-wfs" },
                { text: "WMS图层", link: "/ol-wms" },
                { text: "GeoTIFF图层", link: "/ol-tiff" },
                { text: "聚合图层", link: "/ol-cluster" },
                { text: "热力图", link: "/ol-heatmap" },
                { text: "风场图", link: "/ol-wind" },
                { text: "结合echarts", link: "/ol-echarts" },
              ],
            },
            { text: "轨迹回放", link: "/ol-path" },
            { text: "路径规划", link: "/ol-route" },
            { text: "要素", link: "/ol-feature" },
            { text: "弹框", link: "/ol-overlay" },
          ],
        },
        {
          text: "API",
        },
      ],
      socialLinks: [{ icon: "github", link: "https://github.com/pp129/v3-ol-map" }],
      outline: {
        label: "页面导航",
      },
      search: {
        provider: "local",
      },
    },
    vite: {
      server: {
        open: true,
      },
    },
  }
});
