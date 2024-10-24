<script setup lang="ts">
import { inject, onMounted, ShallowRef, unref } from "vue";
import OlMap from "@/packages/lib";
import { WMSOptions } from "@/packages/types/Tile";
import TileGrid from "ol/tilegrid/TileGrid.js";
import type { Layer, Tile } from "ol/layer";
import { TileWMS } from "ol/source.js";
import MapBrowserEvent from "ol/MapBrowserEvent";

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const layer = inject("ParentTileLayer") as ShallowRef<Layer | Tile>;

const props = withDefaults(defineProps<WMSOptions>(), {});
let tileGrid;
if (props.tileGrid) {
  tileGrid = new TileGrid(props.tileGrid);
}
const wmsOpt = { ...props, tileGrid };
const source = new TileWMS(wmsOpt);
const emit = defineEmits(["singleclick"]);
onMounted(() => {
  if (layer.value) {
    layer.value.setSource(source);
    map.on("singleclick", (evt: MapBrowserEvent<UIEvent>) => {
      const view = map.getView();
      const viewResolution = view.getResolution();
      if (!viewResolution) return;
      const url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection().getCode(), {
        INFO_FORMAT: "application/json",
      });
      if (url) {
        fetch(url)
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            emit("singleclick", evt, data);
          });
      }
    });
  }
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
