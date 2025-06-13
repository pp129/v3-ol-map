<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { VMap, GeoJSON } from "@/packages";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  projection: "EPSG:4326",
};
const geojsonData = ref<GeoJSON>();

// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};

const getVectorData = () => {
  geojsonData.value = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()]],
    },
    properties: {
      name: "Polygon",
    },
  };
};
onMounted(() => {
  getVectorData();
});
</script>

<template>
  <ol-map class="map-container" :view="view">
    <ol-tile tile-type="BAIDU">
      <ol-mask :feature="geojsonData" :opacity="0.5"></ol-mask>
    </ol-tile>
  </ol-map>
</template>

<style scoped></style>
