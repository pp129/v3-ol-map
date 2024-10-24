import { ref, inject, unref, provide, watchEffect, shallowRef } from "vue";
import tileRender, { baiduRender, geotiffRender, tempTileRender } from "./tileRender";
import useBaseLayer from "../baseLayer";
import { Group as LayerGroup, Layer } from "ol/layer.js";
import { OverviewMap } from "ol/control.js";
import type TileLayer from "ol/layer/Tile";
import OlMap from "../../lib";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF.js";
import type { Options as XYZOptions } from "ol/source/XYZ.js";
import type { installOptions } from "../../index.ts";
import type { BaseTileProps } from "../../types/Tile";
import type { Options as OverviewMapOptions } from "ol/control/OverviewMap";
import type { TileType } from "../../types/Tile";
import Map from "ol/Map";
import BaseLayer from "ol/layer/Base";
const tileLayer = ($props: BaseTileProps) => {
  const VMap = inject("VMap") as OlMap;
  const map: Map = unref(VMap).map;
  const $OlMapConfig = inject("$OlMapConfig") as installOptions;
  let props = $props;

  // 默认属性

  let layer = shallowRef<Layer | TileLayer | LayerGroup>();
  let overviewMap = shallowRef<boolean | undefined>(false);
  let OverviewMapOptions = ref<OverviewMapOptions>();
  provide("ParentTileLayer", layer);
  const init = async (isOverviewMap?: boolean) => {
    overviewMap.value = isOverviewMap;
    if (props.tileType) {
      switch (props.tileType.toUpperCase()) {
        case "TDT":
          initTileTD();
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

  const resetTile = (tileType: TileType) => {
    props.tileType = tileType;
    // 清除所有底图
    const baseLayer = map
      .getLayers()
      .getArray()
      .filter((layer: BaseLayer) => layer.get("base"));
    if (baseLayer && baseLayer.length > 0) {
      baseLayer.forEach((layer: BaseLayer) => {
        map.removeLayer(layer);
      });
    }
    init().then();
  };

  // 自定义XYZ
  const initTileCustomer = (init: boolean = true) => {
    layer.value = tileRender(props, props.source as XYZOptions);
    if (init) {
      addToMap();
    } else {
      unref(VMap).map.setLayers([layer.value]);
    }
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
    let Normal,
      Normal_Label,
      Satellite,
      Satellite_Label,
      Terrain,
      Terrain_Label,
      ak = "";
    const { TDT } = $OlMapConfig;
    if (TDT) {
      ({ Normal, Normal_Label, Satellite, Satellite_Label, Terrain, Terrain_Label, ak } = TDT);
    }
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
        url: Normal + ak,
      });
      layerVec.set("base", true);
      const layerCva = tileRender(layerOptions, {
        ...sourceOptions,
        url: Normal_Label + ak,
      });
      layerCva.set("base", true);
      layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
    } else {
      if (style === "Satellite") {
        const layerVec = tileRender(layerOptions, {
          ...sourceOptions,
          url: Satellite + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(layerOptions, {
          ...sourceOptions,
          url: Satellite_Label + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      } else if (style === "Terrain") {
        const layerVec = tileRender(layerOptions, {
          ...sourceOptions,
          url: Terrain + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(layerOptions, {
          ...sourceOptions,
          url: Terrain_Label + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      }
    }
    addToMap(true);
  };
  // 百度地图
  const initTileBaidu = (style?: string) => {
    let Normal,
      Satellite,
      Satellite_Label,
      midnight,
      ak = "";
    const { Baidu } = $OlMapConfig;
    if (Baidu) {
      ({ Normal, Satellite, Satellite_Label, midnight, ak } = Baidu);
    }
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
    let Normal, Satellite, Satellite_Label;
    const { AMap } = $OlMapConfig;
    if (AMap) {
      ({ Normal, Satellite, Satellite_Label } = AMap);
    }
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
    layer.value.set("base", true); // 设置为底图
    if (props.zIndex) {
      layer.value.setZIndex(props.zIndex);
    } else {
      layer.value.setZIndex(0);
    }
    if (group) {
      // unref(VMap).map.setLayerGroup(layer.value as LayerGroup);
      const layerGroup = layer.value as LayerGroup;
      const layers = layerGroup.getLayers().getArray();
      layers.forEach(layer => {
        unref(VMap).map.addLayer(layer);
      });
    } else {
      // unref(VMap).map.setLayers([layer.value]);
      console.log(unref(VMap).map);
      unref(VMap).map?.addLayer(layer.value);
    }
  };
  const addOverviewMap = () => {
    if (!layer.value) return;
    const overviewMap = new OverviewMap({
      ...OverviewMapOptions.value,
      layers: [layer.value],
    });
    overviewMap.setMap(unref(VMap).map);
  };
  const setOverviewMapOptions = async (options: OverviewMapOptions) => {
    OverviewMapOptions.value = options;
    return Promise.resolve();
  };

  const setLayerVisible = (visible: boolean) => {
    layer.value?.setVisible(visible);
  };

  watchEffect(() => {
    useBaseLayer(layer.value, props);
  });

  return {
    init,
    resetTile,
    setOverviewMapOptions,
    setLayerVisible,
  };
};

export default tileLayer;
