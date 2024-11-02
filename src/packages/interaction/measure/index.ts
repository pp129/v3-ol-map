import type { App } from "vue";
import component from "./measure.ts";

const install = (Vue: App) => Vue.component(component.name || "OlMeasure", component);

export default install;
