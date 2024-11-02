import type { App } from "vue";
import component from "./draw.ts";

const install = (Vue: App) => Vue.component(component.name || "OlDraw", component);

export default install;
