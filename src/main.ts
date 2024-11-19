import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";
import olMap from "./packages/index.ts";
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
});
app.mount("#app");
