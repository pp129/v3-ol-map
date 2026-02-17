<script setup lang="ts">
import { ref } from "vue";
import { OlMap, OlTile, OlVector, OlFeature, VMap, FeatureGeometry } from "v3-ol-map";
import icon from "@/assets/vue.svg";

const view: VMap["view"] = {
  zoom: 13,
  center: [118.11022, 24.490474],
};

// 使用 geometries 格式定义要素
const geometriesData = ref<FeatureGeometry[]>([
  {
    type: "Point",
    geometry: {
      coordinates: [118.08022, 24.480474],
    },
    properties: {
      name: "点要素 1",
      description: "使用 geometries 格式",
    },
  },
  {
    type: "Point",
    geometry: {
      coordinates: [118.13022, 24.500474],
    },
    properties: {
      name: "点要素 2",
      description: "geometries Point",
    },
  },
  {
    type: "Circle",
    geometry: {
      center: [118.11022, 24.490474],
      radius: 800,
    },
    properties: {
      name: "圆形要素",
      description: "geometries Circle",
    },
  },
  {
    type: "LineString",
    geometry: {
      coordinates: [
        [118.09022, 24.470474],
        [118.10022, 24.480474],
        [118.11022, 24.490474],
        [118.12022, 24.500474],
      ],
    },
    properties: {
      name: "线要素",
      description: "geometries LineString",
    },
  },
  {
    type: "Polygon",
    geometry: {
      coordinates: [
        [
          [118.09522, 24.510474],
          [118.10522, 24.510474],
          [118.10522, 24.520474],
          [118.09522, 24.520474],
          [118.09522, 24.510474],
        ],
      ],
    },
    properties: {
      name: "多边形要素",
      description: "geometries Polygon",
    },
  },
]);
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-vector
      :z-index="1"
      :layer-style="{
        'icon-src': icon,
        'icon-scale': 1,
        'text-value': ['get', 'name'],
        'text-fill-color': 'white',
        'text-background-fill-color': '#67c23a',
        'text-offset-y': 25,
        'text-padding': [4, 10, 4, 10],
        'stroke-color': '#67c23a',
        'stroke-width': 3,
        'fill-color': 'rgba(103, 194, 58, 0.2)',
      }"
    >
      <ol-feature :geometries="geometriesData" />
    </ol-vector>
  </ol-map>

  <div class="tips">使用 geometries 参数添加要素</div>
</template>

<style scoped>
.tips {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  font-size: 14px;
  color: #333;
  backdrop-filter: blur(10px);
}
</style>
