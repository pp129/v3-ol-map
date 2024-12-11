import type { App } from "vue";
import component from "./index.vue";

const install = (Vue: App) => Vue.component(component.name || "OlZoomSlider", component);

export default install;
