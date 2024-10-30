import OlMap from "../map/index.vue";
import MapBrowserEvent from "ol/MapBrowserEvent";

type defMapOptions = Omit<import("ol/Map").MapOptions, "controls" | "interactions" | "view">;

export interface VMap extends defMapOptions {
  controls?: import("ol/interaction/defaults").DefaultsOptions;
  interactions?: import("ol/interaction/defaults").DefaultsOptions;
  view?: import("ol/View").ViewOptions;
}

export declare type OlMapEvent = MapBrowserEvent<UIEvent>;

export declare type ExposeMap = {
  map: import("ol/Map").default;
  getMap: () => import("ol/Map").default;
  getLayerById: (id: string) => import("ol/layer/Base").default;
  panTo: (params: import("ol/View").AnimationOptions) => void;
};

export declare type OlMapInstance = InstanceType<typeof OlMap>;
