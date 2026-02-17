import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";
import olMap from "v3-ol-map";

const app = createApp(App);
app.use(router);
// app.use(olMap); // 不配置TDTak加载不了在线天地图
app.use(olMap, {
  tdt: {
    ak: "88e2f1d5ab64a7477a7361edd6b5f68a", // 天地图ak
  },
  baidu: {
    ak: "5ieMMexWmzB9jivTq6oCRX9j",
  },
  // 配置默认map参数
  map: {
    view: {
      zoom: 10,
      center: [118.125827, 24.637526],
    },
  },
  // 配置默认tile参数
  tile: {
    tileType: "XYZ",
    source: {
      url: import.meta.env.VITE_MAP_URL,
      projection: "EPSG:4490",
    },
  },
});
app.mount("#app");
