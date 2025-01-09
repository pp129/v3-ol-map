import DefaultTheme from "vitepress/theme";
// import OlMap from "v3-ol-map";
import "v3-ol-map/lib/v3-ol-map.css";
import "./index.css";
import Preview from "../components/preview/index.vue";
import DocsIframe from "../components/docsIframe/index.vue";

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app, router, siteData }) => {
    // app.use(OlMap, {
    //   tdt: {
    //     ak: "88e2f1d5ab64a7477a7361edd6b5f68a", // 天地图ak
    //   },
    //   map: {
    //     view: {
    //       zoom: 8,
    //       center: [118.125827, 24.637526],
    //     },
    //   },
    // });
    app.component("preview", Preview);
    app.component("docsIframe", DocsIframe);
  },
};
