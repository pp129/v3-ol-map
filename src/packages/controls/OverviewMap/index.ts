import type { App } from "vue";
import component from "../OverviewMap/index.vue";

const install = (Vue: App) => Vue.component(component.name || "OlOverview", component);

export default install;
