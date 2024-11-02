import type { App } from "vue";
import component from "./feature.ts";

const install = (Vue: App) => Vue.component(component.name || "OlFeature", component);

export default install;
