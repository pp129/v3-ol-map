import { watch } from "vue";
import { Options } from "ol/layer/Base";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import GeoTIFFLayer from "ol/layer/WebGLTile";
import VectorLayer from "ol/layer/Vector";
import { Group as LayerGroup, Heatmap, Layer } from "ol/layer";
import type TileLayer from "ol/layer/Tile";

export interface BaseLayerOptions extends Omit<Options, "source"> {}
const useBaseLayer = (
  layer: VectorLayer | Heatmap | ImageLayer<Static> | GeoTIFFLayer | Layer | TileLayer | LayerGroup | undefined,
  props: BaseLayerOptions,
) => {
  watch(
    () => props.visible,
    nVal => {
      if (layer) {
        const visible = !!nVal;
        layer?.setVisible(visible);
      }
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.extent,
    nVal => {
      layer?.setExtent(nVal);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.maxResolution,
    nVal => {
      if (nVal || nVal === 0) layer?.setMaxResolution(nVal);
    },
  );
  watch(
    () => props.minResolution,
    nVal => {
      if (nVal || nVal === 0) layer?.setMinResolution(nVal);
    },
  );
  watch(
    () => props.opacity,
    nVal => {
      if (nVal || nVal === 0) layer?.setOpacity(nVal);
    },
  );
  watch(
    () => props.zIndex,
    nVal => {
      if (nVal || nVal === 0) layer?.setZIndex(nVal);
    },
  );
  watch(
    () => props.maxZoom,
    nVal => {
      if (nVal || nVal === 0) layer?.setMaxZoom(nVal);
    },
  );
  watch(
    () => props.minZoom,
    nVal => {
      if (nVal || nVal === 0) layer?.setMinZoom(nVal);
    },
  );
};

export default useBaseLayer;
