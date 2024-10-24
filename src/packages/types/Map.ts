import { AnimationOptions } from "ol/View";
import MapBrowserEvent from "ol/MapBrowserEvent";

type defMapOptions = Omit<import("ol/Map").MapOptions, "controls" | "interactions" | "view">;

export interface VMap extends defMapOptions {
  controls?: import("ol/interaction/defaults").DefaultsOptions;
  interactions?: import("ol/interaction/defaults").DefaultsOptions;
  view?: import("ol/View").ViewOptions;
}

export declare type OlMapEvent = MapBrowserEvent<UIEvent>;

declare const _default: import("vue").DefineComponent<
  {},
  {
    map: import("../lib/index").default;
    getMap: () => import("ol/Map").default | void;
    getLayerById: (id: string) => import("ol/layer/Base").default | void;
    panTo: (param: AnimationOptions) => void;
  }
>;

export declare type OlMapInstance = InstanceType<typeof _default>;
