import { watch } from "vue";
import { Options } from "ol/layer/Base";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import GeoTIFFLayer from "ol/layer/WebGLTile";
import VectorLayer from "ol/layer/Vector";
import { Group as LayerGroup, Heatmap, Layer } from "ol/layer";
import type TileLayer from "ol/layer/Tile";
import { WindLayer } from "ol-wind";
import { Extent } from "ol/extent";

export interface BaseLayerOptions extends Omit<Options, "source"> {}
const useBaseLayer = (
  layer:
    | VectorLayer
    | Heatmap
    | ImageLayer<Static>
    | GeoTIFFLayer
    | Layer
    | TileLayer
    | LayerGroup
    | WindLayer
    | undefined
    | null,
  props: BaseLayerOptions,
) => {
  const setVisible = (val: boolean | undefined) => {
    if (layer) {
      const visible = !!val;
      layer?.setVisible(visible);
    }
  };
  watch(
    () => props.visible,
    nVal => {
      setVisible(nVal);
    },
    {
      deep: true,
    },
  );
  const setExtent = (val: Extent | undefined) => {
    layer?.setExtent(val);
  };
  watch(
    () => props.extent,
    nVal => {
      setExtent(nVal);
    },
    {
      deep: true,
    },
  );
  const setMaxResolution = (val: number | undefined) => {
    if (val || val === 0) layer?.setMaxResolution(val);
  };
  watch(
    () => props.maxResolution,
    nVal => {
      setMaxResolution(nVal);
    },
  );
  const setMinResolution = (val: number | undefined) => {
    if (val || val === 0) layer?.setMinResolution(val);
  };
  watch(
    () => props.minResolution,
    nVal => {
      setMinResolution(nVal);
    },
  );
  const setOpacity = (val: number | undefined) => {
    if (val || val === 0) layer?.setOpacity(val);
  };
  watch(
    () => props.opacity,
    nVal => {
      setOpacity(nVal);
    },
  );
  const setZIndex = (val: number | undefined) => {
    if (val || val === 0) layer?.setZIndex(val);
  };
  watch(
    () => props.zIndex,
    nVal => {
      setZIndex(nVal);
    },
  );
  const setMaxZoom = (val: number | undefined) => {
    if (val || val === 0) layer?.setMaxZoom(val);
  };
  watch(
    () => props.maxZoom,
    nVal => {
      setMaxZoom(nVal);
    },
  );
  const setMinZoom = (val: number | undefined) => {
    if (val || val === 0) layer?.setMinZoom(val);
  };
  watch(
    () => props.minZoom,
    nVal => {
      setMinZoom(nVal);
    },
  );

  const onMounted = () => {
    setVisible(props.visible);
    setExtent(props.extent);
    setMaxResolution(props.maxResolution);
    setMinResolution(props.minResolution);
    setOpacity(props.opacity);
    setZIndex(props.zIndex);
    setMaxZoom(props.maxZoom);
    setMinZoom(props.minZoom);
  };
  return {
    onMounted,
  };
};

export default useBaseLayer;
