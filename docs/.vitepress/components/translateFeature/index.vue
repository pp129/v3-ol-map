<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  OlMap,
  OlTile,
  OlVector,
  OlFeature,
  VMap,
  FeatureGeometry,
  VectorLayerOptions
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 12,
  center: [118.11022, 24.490474],
};
const layerStyle: VectorLayerOptions["layerStyle"] = [
  {
    filter: ["==", ["get", "name"], "Circle"],
    style: {
      "text-value": ["get", "radius_size"],
      "text-fill-color": "white",
      "text-background-fill-color": "black",
      "text-offset-y": 0,
      "text-font": "bold 16px serif",
      "text-padding": [2, 8, 2, 8],
      "stroke-color": "red", //圆的边框颜色
      "stroke-width": 4, //圆的边框宽度
      "fill-color": "rgba(0,255,255,0.5)", //圆的填充颜色
    },
  },
  {
    filter: ["==", ["get", "name"], "Polygon"],
    style: {
      "text-value": "多边形",
      "text-fill-color": "white",
      "text-background-fill-color": "green",
      "text-offset-y": 0,
      "text-font": "bold 16px serif",
      "text-padding": [2, 8, 2, 8],
      "stroke-color": "pink", //圆的边框颜色
      "stroke-width": 4, //圆的边框宽度
      "fill-color": "rgba(255,255,0,0.5)", //圆的填充颜色
    },
  },
  {
    else: true,
    style: {
      "text-value": ["get", "name"],
      "text-fill-color": "white",
      "text-background-fill-color": "red",
      "text-offset-y": 28,
      "text-padding": [2, 8, 2, 8],
      "icon-src": "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/vue.svg",
      "stroke-color": "black", //圆的边框颜色
      "stroke-width": 8, //圆的边框宽度
      "fill-color": "rgba(255,255,0,0.5)", //圆的填充颜色
    },
  },
];
let geometryData = ref<FeatureGeometry[]>();
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};
onMounted(()=> {
  geometryData.value = [
    {
      type: "Circle",
      geometry: {
        center: mockCoordinates(),
        radius: 500,
      },
      properties: {
        name: "Circle",
        radius_size: "500",
      },
    },
    {
      type: "Polygon",
      geometry: {
        coordinates: [[mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()]],
      },
      properties: {
        name: "Polygon",
      },
    },
    {
      type: "LineString",
      geometry: {
        coordinates: [mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()],
      },
      properties: {
        name: "LineString",
      },
    },
  ];
})
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-vector
      :layer-style="layerStyle"
      :z-index="1"
      :translate="true"
    >
      <ol-feature :geometries="geometryData" />
    </ol-vector>
  </ol-map>
</template>

<style scoped>

</style>
