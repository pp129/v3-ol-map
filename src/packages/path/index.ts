import type { App } from "vue";
import component from "./path.ts";

const install = (Vue: App) => Vue.component(component.name || "OlPath", component);

export default install;
