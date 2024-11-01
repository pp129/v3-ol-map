<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GeoJSON, VMap } from "@/packages";

const view: VMap["view"] = {
  zoom: 11,
  minZoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  smoothExtentConstraint: true,
  constrainResolution: true,
};

let maxWeight = ref(1);
const setWeight = (feature: any) => {
  const name: number = feature.get("value");
  return name / maxWeight.value;
};
let heatmapJson = ref<GeoJSON>();
const heatmapData = (i: number) => {
  fetch(`${import.meta.env.VITE_BASE_URL}/heatmap/lonlat${i}.json`)
    .then(res => res.json())
    .then(data => {
      // 对象数组{value:number}[]中value的最大值
      maxWeight.value = Math.max(...data.map((item: any) => item.value));
      // console.log(max);
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
let radius = ref(3);
let blur = ref(20);
const getHeatMapData = () => {
  heatmapData(index.value);
  setTimeout(() => {
    if (index.value < 23) {
      index.value++;
      getHeatMapData();
    }
  }, 1000);
};

const handleZoom = (event: any) => {
  const { zoom } = event;
  // 实现效果：不同层级下的热力图效果相近，目前只能做到相近。。。
  // 实现以11级radius对应是3为基准，每大一级，radius的值增大，如果直接每级+3，颜色会太深，用曲线函数会比直线函数效果好，实验出效果比较好的公式：2 + (z - 11) * (z - 11)^1.5 ，指数的值是个玄学
  radius.value = 3 + (zoom - 11) * Math.pow(1.5, zoom - 11);
  // radius.value = 2 + (zoom - 11) * 2;
};

onMounted(() => {
  getHeatMapData();
});
</script>

<template>
  <ol-map :view="view" @changeZoom="handleZoom">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-heatmap :z-index="8" class-name="heatmap" :weight="setWeight" :radius="radius" :blur="blur">
      <ol-feature :geo-json="heatmapJson" />
    </ol-heatmap>
  </ol-map>
</template>

<style scoped></style>
