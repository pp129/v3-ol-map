<script setup lang="ts">
import { ref } from "vue";
import { OlMapInstance, VMap } from "@/packages";

const mapContainer = ref<OlMapInstance>();
const view: VMap["view"] = {
  zoom: 12,
  center: [118.11022, 24.490474],
  smoothExtentConstraint: true,
  constrainResolution: true,
};
</script>

<template>
  <ol-map ref="mapContainer" class="mapContainer" :view="view">
    <ol-tile :z-index="0" tile-type="BAIDU" :preload="Infinity"></ol-tile>
  </ol-map>
</template>

<style scoped></style>
