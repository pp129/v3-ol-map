import { BaseTileProps, ConfigProviderContext, defaultOlMapConfig } from "@/packages";
import { inject, onMounted, Ref, ShallowRef, shallowRef, watchEffect } from "vue";
import Layer from "ol/layer/Layer";
import type TileLayer from "ol/layer/Tile";
import LayerGroup from "ol/layer/Group";
import tileRender from "@/packages/layers/tile/tileRender.ts";
import useBaseLayer from "@/packages/layers/baseLayer";

export const useTile = (props: BaseTileProps) => {
  const configProvider: ConfigProviderContext | undefined = inject("ConfigProvide", undefined);
  const $OlMapConfig = configProvider ?? (inject("$OlMapConfig") as ConfigProviderContext);

  const layer = shallowRef<Layer | TileLayer | LayerGroup>();

  const init = () => {
    if (props.tileType) {
      switch (props.tileType.toUpperCase()) {
        case "TDT":
          setTDT();
          break;
      }
    } else {
    }
  };

  const setTDT = (style?: string) => {
    const TDT = { ...defaultOlMapConfig.tdt, ...$OlMapConfig?.tdt };
    let { Normal, Normal_Label, Satellite, Satellite_Label, Terrain, Terrain_Label, ak } = TDT;
    try {
      if (!ak) {
        throw new Error("请配置天地图ak!");
      }
    } catch (error) {
      console.error(error);
    }
    const sourceOptions = {
      ...props,
      projection: "EPSG:3857",
    };
    if (!style || style === "Normal") {
      const layerVec = tileRender(props, {
        ...sourceOptions,
        url: (Normal || "") + ak,
      });
      layerVec.set("base", true);
      const layerCva = tileRender(props, {
        ...sourceOptions,
        url: (Normal_Label || "") + ak,
      });
      layerCva.set("base", true);
      layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
    } else {
      if (style === "Satellite") {
        const layerVec = tileRender(props, {
          ...sourceOptions,
          url: (Satellite || "") + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(props, {
          ...sourceOptions,
          url: (Satellite_Label || "") + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      } else if (style === "Terrain") {
        const layerVec = tileRender(props, {
          ...sourceOptions,
          url: (Terrain || "") + ak,
        });
        layerVec.set("base", true);
        const layerCva = tileRender(props, {
          ...sourceOptions,
          url: (Terrain_Label || "") + ak,
        });
        layerCva.set("base", true);
        layer.value = new LayerGroup({ layers: [layerVec, layerCva] });
      }
    }
  };

  const getLayer = (): TileLayer | Layer | LayerGroup | undefined => {
    return layer.value;
  };

  watchEffect(() => {
    if (layer.value) useBaseLayer(layer.value, props);
  });

  onMounted(() => {
    init();
  });

  return {
    getLayer,
  };
};
