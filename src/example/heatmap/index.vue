<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GeoJSON, VMap } from "@/packages";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
};
const setWeight = (feature: any) => {
  const name: number = feature.get("value");
  return name / 10;
};
let heatmapJson = ref<GeoJSON>();
const heatmapData = (i: number) => {
  fetch(`/lonlat${i}.json`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      heatmapJson.value = {
        type: "FeatureCollection",
        features: [...data].map(item => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [item.longitude, item.latitude],
            },
            properties: item,
          };
        }),
      };
    });
};
let index = ref(0);

const getHeatMapData = () => {
  heatmapData(index.value);
  setTimeout(() => {
    if (index.value < 23) {
      index.value++;
      getHeatMapData();
    }
  }, 1000);
};

onMounted(() => {
  getHeatMapData();
});
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-heatmap :z-index="8" class-name="heatmap" :weight="setWeight" :radius="5" :blur="40">
      <ol-feature :geo-json="heatmapJson" />
    </ol-heatmap>
  </ol-map>
</template>

<style scoped></style>
