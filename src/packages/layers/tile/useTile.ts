import { ref, inject, unref, provide, watchEffect, shallowRef } from "vue";
import tileRender, { baiduRender, geotiffRender, OSMRender, tempTileRender } from "./tileRender.ts";
import useBaseLayer from "../baseLayer/index.ts";
import LayerGroup from "ol/layer/Group";
import Layer from "ol/layer/Layer";
import { OverviewMap } from "ol/control.js";
import type TileLayer from "ol/layer/Tile";
import OlMap from "../../lib/index.ts";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF.js";
import type { Options as XYZOptions } from "ol/source/XYZ.js";
import { defaultOlMapConfig, type ConfigProviderContext, type BaseTileProps, TileLayerEmitFnType } from "@/packages";
import type { Options as OverviewMapOptions } from "ol/control/OverviewMap";
import Map from "ol/Map";
import BaseLayer from "ol/layer/Base";
import { nanoid } from "nanoid";

const tileLayer = ($props: BaseTileProps, $emit: TileLayerEmitFnType) => {
  const VMap = inject("VMap") as OlMap;
  const map: Map = unref(VMap).map;
  const configProvider: ConfigProviderContext | undefined = inject("ConfigProvide", undefined);
  const $OlMapConfig = configProvider ?? (inject("$OlMapConfig") as ConfigProviderContext);
  let props = $props;

  // 默认属性

  let layer = shallowRef<Layer | TileLayer | LayerGroup | null>(null);
  let overviewMap = shallowRef<boolean | undefined>(false);
  let overviewMapTarget = shallowRef<OverviewMap>();
  let OverviewMapOptions = ref<OverviewMapOptions>();
  provide("ParentTileLayer", layer);

  const init = async (isOverviewMap?: boolean) => {
    overviewMap.value = isOverviewMap;
    const config = $OlMapConfig || defaultOlMapConfig;
    const tileType = props.tileType ? props.tileType : config.tile?.tileType;
    if (tileType) {
      switch (tileType.toUpperCase()) {
        case "TDT":
          initTileTD();
          break;
        case "OSM":
          initTileOSM();
          break;
        case "TDT_SATELLITE":
          initTileTD("Satellite");
          break;
        case "TDT_TERRAIN":
          initTileTD("Terrain");
          break;
        case "BAIDU":
          initTileBaidu();
          break;
        case "BAIDU_SATELLITE":
          initTileBaidu("Satellite");
          break;
        case "BAIDU_MIDNIGHT":
          initTileBaidu("midnight");
          break;
        case "AMAP":
          initTileAMap();
          break;
        case "AMAP_SATELLITE":
          initTileAMap("Satellite");
          break;
        case "GEOTIFF":
          initTileGeoTiff();
          break;
        case "CUSTOMER":
        case "XYZ":
          initTileCustomer();
          break;
        default:
          initTile();
          break;
      }
    } else {
      initTile();
    }
  };

  const resetTile = async (layer: Layer | TileLayer | LayerGroup) => {
    // 清除所有底图
    if (layer && layer.get("group")) {
      const layers = (layer as LayerGroup).getLayers().getArray();
      layers.forEach(tile => {
        map.removeLayer(tile);
      });
    } else {
      map.removeLayer(layer);
    }
    await init();
  };

  // 自定义XYZ
  const initTileCustomer = () => {
    const config = $OlMapConfig || defaultOlMapConfig;
    const source = props.source ? props.source : config.tile?.source;
    layer.value = tileRender(props, source);
    addToMap();
  };
  const initTile = (init: boolean = true) => {
    layer.value = tempTileRender(props);
    if (init) {
      addToMap();
    } else {
      unref(VMap).map.setLayers([layer.value]);
    }
  };
  // 天地图-矢量图-带标注
  const initTileTD = (style?: string) => {
    const TDT = { ...defaultOlMapConfig.tdt, ...$OlMapConfig?.tdt };
    let { Normal, Normal_Label, Satellite, Satellite_Label, Terrain, Terrain_Label, ak } = TDT;
    try {
      if (!ak) {
        throw new Error("请配置天地图ak!");
      }
    } catch (error) {
      console.error(error);
    }
    const layerOptions = { ...props };
    const sourceOptions = {
      ...props.source,
      projection: "EPSG:3857",
    };
    if (!style || style === "Normal") {
      const layerVec = tileRender(layerOptions, {
        ...sourceOptions,
        url: (Normal || "") + ak,
      });
      layerVec.set("base", true);
      const layerCva = tileRender(layerOptions, {
        ...sourceOptions,
        url: (Normal_Label || "") + ak,
      });
      layerCva.set("base", true);
      layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
    } else {
      if (style === "Satellite") {
        const layerVec = tileRender(layerOptions, {
          ...sourceOptions,
          url: (Satellite || "") + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(layerOptions, {
          ...sourceOptions,
          url: (Satellite_Label || "") + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      } else if (style === "Terrain") {
        const layerVec = tileRender(layerOptions, {
          ...sourceOptions,
          url: (Terrain || "") + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(layerOptions, {
          ...sourceOptions,
          url: (Terrain_Label || "") + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      }
    }
    addToMap(true);
  };
  // OSM
  const initTileOSM = () => {
    const layerOptions = { ...props };
    const sourceOptions = {
      ...props.source,
      projection: "EPSG:3857",
    };
    layer.value = OSMRender(layerOptions, sourceOptions);
    addToMap();
  };
  // 百度地图
  const initTileBaidu = (style?: string) => {
    const Baidu = { ...defaultOlMapConfig.baidu, ...$OlMapConfig?.baidu };
    let { Normal, Satellite, Satellite_Label, midnight, ak } = Baidu;
    if (!style || style === "Normal") {
      if (Normal) {
        layer.value = baiduRender(props, props.source as XYZOptions, Normal);
        addToMap();
      }
    } else if (style === "Satellite") {
      if (Satellite && Satellite_Label) {
        const layerVec = baiduRender(props, props.source as XYZOptions, Satellite);
        layerVec.set("base", true);
        const layerCva = baiduRender(props, props.source as XYZOptions, Satellite_Label);
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
        addToMap(true);
      }
    } else if (style === "midnight") {
      if (midnight) {
        try {
          if (!ak) {
            throw new Error("个性化地图请配置百度地图ak!");
          }
        } catch (error) {
          console.error(error);
        }
        layer.value = baiduRender(props, props.source as XYZOptions, midnight + ak);
        addToMap();
      }
    }
  };
  // 高德地图
  const initTileAMap = (style?: string) => {
    const AMap = { ...defaultOlMapConfig.amap, ...$OlMapConfig?.amap };
    let { Normal, Satellite, Satellite_Label } = AMap;
    if (!style || style === "Normal") {
      const sourceOptions = {
        ...props.source,
        url: Normal,
        projection: "GCJ:02",
      };
      layer.value = tileRender(props, sourceOptions);
      addToMap();
    } else if (style === "Satellite") {
      const sourceOptions = {
        ...props.source,
        url: Satellite,
        projection: "GCJ:02",
      };
      const sourceOptions2 = {
        ...props.source,
        url: Satellite_Label,
        projection: "GCJ:02",
      };
      const layerVec = tileRender(props, sourceOptions);
      layerVec.set("base", true);
      const layerCva = tileRender(props, sourceOptions2);
      layerCva.set("base", true);
      layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      addToMap(true);
    }
  };
  // GeoTIFF图层加载
  const initTileGeoTiff = () => {
    layer.value = geotiffRender(props, <GeoTIFFOptions>props.source);
    addToMap();
  };
  // 添加到地图
  const addToMap = (group?: boolean) => {
    if (overviewMap.value) {
      addOverviewMap();
    } else {
      addTileLayer(group);
    }
  };
  const addTileLayer = (group?: boolean) => {
    if (!layer.value) return;
    const layerId = props.layerId || `tile-layer-${nanoid()}`;
    layer.value.set("id", layerId);
    layer.value.set("layerTypeName", "TileLayer");
    layer.value.set("base", true); // 设置为底图
    if (props.zIndex) {
      layer.value.setZIndex(props.zIndex);
    } else {
      layer.value.setZIndex(0);
    }
    if (group) {
      // unref(VMap).map.setLayerGroup(layer.value as LayerGroup);
      layer.value.set("group", true);
      const layerGroup = layer.value as LayerGroup;
      const layers: BaseLayer[] = layerGroup.getLayers().getArray();
      layers.forEach(layer => {
        map?.addLayer(layer);
      });
    } else {
      (layer.value as Layer).on("sourceready", evt => {
        $emit("sourceready", evt);
      });
      (layer.value as Layer).on("change:visible", evt => {
        $emit("change:visible", evt);
      });
      map?.addLayer(layer.value);
    }
  };
  const addOverviewMap = () => {
    if (!layer.value) return;
    overviewMapTarget.value = new OverviewMap({
      ...OverviewMapOptions.value,
      layers: [layer.value],
    });
    overviewMapTarget.value.setMap(unref(VMap).map);
  };
  const setOverviewMapOptions = async (options: OverviewMapOptions) => {
    OverviewMapOptions.value = options;
    return Promise.resolve();
  };
  const resetOverviewMap = () => {
    if (overviewMapTarget.value) {
      unref(VMap).map.removeControl(overviewMapTarget.value);
      addOverviewMap();
    }
  };

  const setLayerVisible = (visible: boolean) => {
    layer.value?.setVisible(visible);
  };

  const getLayer = () => {
    return layer.value;
  };

  const clearTile = () => {
    if (layer.value?.get("group")) {
      const layerGroup = layer.value as LayerGroup;
      const layers: BaseLayer[] = layerGroup.getLayers().getArray();
      layers.forEach(layer => {
        map?.removeLayer(layer);
      });
    } else {
      map?.removeLayer(layer.value as Layer);
    }
    layer.value = null;
  };

  watchEffect(() => {
    if (layer.value) useBaseLayer(layer.value, props);
  });

  return {
    init,
    resetTile,
    setOverviewMapOptions,
    resetOverviewMap,
    setLayerVisible,
    getLayer,
    clearTile,
  };
};

export default tileLayer;
