<script setup lang="ts">
import { inject, onMounted, ShallowRef, unref, watch } from "vue";
import OlMap from "@/packages/lib";
import { WMSOptions } from "@/packages/types/WMS";
import TileGrid from "ol/tilegrid/TileGrid.js";
import type { Layer, Tile } from "ol/layer";
import { ImageWMS, TileWMS } from "ol/source.js";
import MapBrowserEvent from "ol/MapBrowserEvent";
import ImageLayer from "ol/layer/Image";

defineOptions({
  name: "OlWms",
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const layer = inject("ParentTileLayer") as ShallowRef<ImageLayer<import("ol/source/Image.js").default> | Tile | Layer>;

const props = withDefaults(defineProps<WMSOptions>(), {});

const emit = defineEmits(["singleclick", "dblclick", "pointermove"]);

const init = () => {
  if (layer.value) {
    const layerTypeName = layer.value?.get("layerTypeName");
    let tileGrid;
    let source: ImageWMS | TileWMS | undefined;
    if (props.tileGrid) {
      tileGrid = new TileGrid(props.tileGrid);
    }
    if (layerTypeName === "ImageLayer") {
      const wmsOpt = { ...props, tileGrid };
      source = new ImageWMS(wmsOpt);
      (layer.value as ImageLayer<import("ol/source/Image.js").default>).setSource(source);
    } else if (layerTypeName === "TileLayer") {
      const wmsOpt = { ...props, tileGrid };
      source = new TileWMS(wmsOpt);
      (layer.value as Tile).setSource(source);
    }

    if (!source) return;

    map.on("pointermove", async function (evt) {
      if (evt.dragging) {
        return;
      }
      const data: any = layer.value.getData(evt.pixel);
      const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
      const featureInfo = await handleGetFeatureInfo(evt, source);
      emit("pointermove", evt, featureInfo);
    });
    map.on("singleclick", async (evt: MapBrowserEvent<any>) => {
      const featureInfo = await handleGetFeatureInfo(evt, source);
      emit("singleclick", evt, featureInfo);
    });
    map.on("dblclick", async (evt: MapBrowserEvent<any>) => {
      const featureInfo = await handleGetFeatureInfo(evt, source);
      emit("dblclick", evt, featureInfo);
    });
  }
};

const handleGetFeatureInfo = async (evt: MapBrowserEvent<any>, source: TileWMS | ImageWMS) => {
  const view = map.getView();
  const viewResolution = view.getResolution();
  if (!viewResolution) return;
  const url = source?.getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection().getCode(), {
    INFO_FORMAT: "application/json",
  });
  if (url) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error("Error fetching feature info:", error);
        return null;
      });
  }
};

watch(
  () => props.params,
  newVal => {
    if (newVal) {
      updateParams(newVal);
    }
  },
  { deep: true, immediate: false },
);

const updateParams = (params: any) => {
  if (!layer.value) return;
  const source = layer.value.getSource() as TileWMS | ImageWMS;
  source.updateParams(params);
};

onMounted(() => {
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
