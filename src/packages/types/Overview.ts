import OlOverview from "../controls/OverviewMap.vue";
import type { Options } from "ol/control/OverviewMap";
import type { BaseTileProps } from "../index.ts";

export interface OverviewMapOptions extends Options, BaseTileProps {}

export declare type OlOverviewInstance = InstanceType<typeof OlOverview>;
