import type { App } from "vue";
import component from "./index.vue";

const install = (Vue: App) => Vue.component(component.name || "OlFullScreen", component);

export default install;
