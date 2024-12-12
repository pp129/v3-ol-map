<script setup lang="ts">
import { ref } from "vue";
import { OlMapInstance, VMap } from "@/packages";

const mapContainer = ref<OlMapInstance>();
const view: VMap["view"] = {
  zoom: 12,
  city: "厦门",
  smoothExtentConstraint: true,
  constrainResolution: true,
};
const handleClick = () => {
  console.log(mapContainer.value);
};
</script>

<template>
  <ol-map ref="mapContainer" class="mapContainer" :view="view" @singleclick="handleClick">
    <ol-tile :z-index="0" tile-type="BAIDU" :preload="Infinity"></ol-tile>
  </ol-map>
</template>

<style scoped></style>
