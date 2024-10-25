import { createApp } from "vue";
// import "../polyfill/polyfill";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";
import olMap from "./packages";
const app = createApp(App);
app.use(router);
app.use(olMap, {
  TDT: {
    ak: "88e2f1d5ab64a7477a7361edd6b5f68a", // 天地图ak
  },
  Baidu: {
    ak: "5ieMMexWmzB9jivTq6oCRX9j",
  },
});
app.mount("#app");
