import OlMousePosition from "../controls/MousePosition/index.vue";
import { Options as defaultOptions } from "ol/control/MousePosition";
// type defaultOptions = import("ol/control/MousePosition");

type Options = Omit<defaultOptions, "coordinateFormat" | "target">;

export interface MousePositionOptions extends Options {
  coordinateFormat?: number | string;
}
export declare type OlMousePositionInstance = InstanceType<typeof OlMousePosition>;
