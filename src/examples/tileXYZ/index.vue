<script lang="ts" setup>
import { OlMap, OlTile, type SourceXYZ, type VMap } from "v3-ol-map";
import { ref, type Ref } from "vue";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  projection: "EPSG:4326",
};
const xyz = ref({
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  projection: "EPSG:3857",
  crossOrigin: "anonymous",
});
const source = ref<Ref<SourceXYZ>>(xyz);
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="XYZ" :source="source" :z-index="0"></ol-tile>
  </ol-map>
</template>

<style scoped></style>
