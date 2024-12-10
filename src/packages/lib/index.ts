import "ol/ol.css";
import { Map, View } from "ol";
import { defaults as defaultInteractions } from "ol/interaction.js";
import { defaults as defaultControls } from "ol/control.js";
import definedProjection from "../utils/projection.ts";
import { VMap } from "../types/index.ts";
import { getCenterByCity } from "../utils/city.ts";

class OlMap {
  map: Map; // 地图对象
  constructor(option: VMap) {
    // 初始注册坐标系
    definedProjection();
    // view默认参数
    const viewDefaultOption = {
      center: [108.5525, 34.3227], // China
      zoom: 5,
      constrainResolution: false,
      projection: "EPSG:4326",
    };
    let viewOption: VMap["view"] = { ...viewDefaultOption, ...option.view };
    if (viewOption?.city) {
      viewOption.center = getCenterByCity(viewOption.city) || viewOption.center || viewDefaultOption.center;
    }
    const view = new View(viewOption);
    // 生成地图
    this.map = new Map({
      target: option.target,
      view,
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
        ...option.controls,
      }),
      interactions: defaultInteractions({
        doubleClickZoom: false,
        ...option.interactions,
      }),
    });
  }
}

export default OlMap;
