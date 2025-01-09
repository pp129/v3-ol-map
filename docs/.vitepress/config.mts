import { defineConfig } from "vitepress";
import crypto from "node:crypto";
import { Worker } from "node:worker_threads";
import { resolve } from "path";

// https://vitepress.dev/reference/site-config
export default defineConfig(() => {
  globalThis.Worker ??= Worker;
  globalThis.crypto ??= crypto;
  console.log(__dirname);
  return {
    base: "/",
    lang: "zh-CN",
    title: "v3-ol-map",
    description: "vue3+openLayers组件",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "Home", link: "/" },
        { text: "组件", link: "/markdown-examples" },
        // { text: "API", link: "/api-examples" },
      ],
      sidebar: [
        {
          text: "Examples",
          items: [
            { text: "配置项", link: "/examples/ol-config" },
            { text: "地图", link: "/examples/ol-map" },
            {
              text: "控制类组件",
              items: [
                { text: "鹰眼图", link: "/examples/ol-overview" },
                { text: "鼠标位置", link: "/examples/ol-mouse-position" },
                { text: "其他", link: "/examples/other-controls" },
              ],
            },
            {
              text: "交互类组件",
              items: [
                { text: "拖拽旋转和缩放", link: "/examples/ol-drag-rotate-and-zoom" },
                { text: "测量", link: "/examples/ol-measure" },
                { text: "绘制", link: "/examples/ol-draw" },
              ],
            },
            {
              text: "图层",
              items: [
                { text: "栅格图层", link: "/examples/ol-tile" },
                { text: "矢量图层", link: "/examples/ol-vector" },
                { text: "WebGLVector图层", link: "/examples/ol-webgl-vector" },
                { text: "WFS图层", link: "/examples/ol-wfs" },
                { text: "WMS图层", link: "/examples/ol-wms" },
                { text: "GeoTIFF图层", link: "/examples/ol-tiff" },
                { text: "聚合图层", link: "/examples/ol-cluster" },
                { text: "热力图", link: "/examples/ol-heatmap" },
                { text: "风场图", link: "/examples/ol-wind" },
                { text: "结合echarts", link: "/examples/ol-echarts" },
              ],
            },
            { text: "要素", link: "/examples/ol-feature" },
            { text: "弹框", link: "/examples/ol-overlay" },
            { text: "轨迹回放", link: "/examples/ol-path" },
            { text: "路径规划", link: "/examples/ol-route" },
          ],
        },
        // {
        //   text: "API",
        // },
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
        proxy: {
          "/JointApi": {
            target: "http://36.248.238.35:8888/admin-api",
            changeOrigin: true,
            rewrite: (path: string) => {
              const regex = new RegExp("/JointApi", "g");
              return path.replace(regex, "");
            },
          },
        },
      },
      resolve: {
        extensions: [".ts", ".vue", ".js", ".json", ".css", ".node", ".sass", "md"],
        alias: [
          {
            find: "@comp",
            replacement: resolve(__dirname, "components"),
          },
        ],
      },
    },
  };
});
