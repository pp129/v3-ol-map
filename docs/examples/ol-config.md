# Config 配置项

## 全局配置

```ts
import { createApp } from "vue";
import App from "@/App.vue";
import OlMap from "v3-ol-map";

const app = createApp(App);
app.use(olMap, {
  tdt: {
    ak: "your tdt ak",
  },
  map: {
    view: {
      zoom: 8,
      center: [118.125827, 24.637526],
    },
  },
});
app.mount("#app");

```

## 组件化配置

<preview comp="config"></preview>
