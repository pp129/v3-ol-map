<script setup lang="ts">
import { ref } from "vue";
import { OlMap, OlTile, OlMapInstance, VMap } from "v3-ol-map";

const mapContainer = ref<OlMapInstance>();
const view: VMap["view"] = {
  zoom: 12,
  city: "厦门",
  smoothExtentConstraint: true,
  constrainResolution: true,
};
</script>

<template>
  <ol-map target="demoView" ref="mapContainer" :view="view">
    <ol-tile :z-index="0" tile-type="BAIDU" :preload="Infinity"></ol-tile>
  </ol-map>
</template>
