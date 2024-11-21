<script setup lang="ts">
import { SourceOptions, VMap } from "@/packages";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
};
const xyz: SourceOptions = {
  url: "http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}",
  projection: "EPSG:3857",
};
</script>

<template>
  <ol-map class="map-container" :view="view">
    <ol-tile tile-type="XYZ" :source="xyz" :z-index="1"></ol-tile>
  </ol-map>
</template>

<style scoped></style>
