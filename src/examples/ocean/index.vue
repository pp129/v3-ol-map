<script setup lang="ts">
import { GeoJSON, SourceXYZ, VMap, VectorLayerOptions } from "@/packages";
import { Ref, ref } from "vue";
import cluster2 from "@/assets/images/cluster2.png";
const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  projection: "EPSG:4326",
};
let xyz = ref({
  url: "http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}",
  projection: "EPSG:3395",
});
let source = ref<Ref<SourceXYZ>>(xyz);
let tileType = ref("ocean");
const tileTypeList = [
  { value: "ocean", label: "海图" },
  { value: "ocean-land", label: "陆海图" },
];
const handleSelect = () => {
  if (tileType.value === "ocean") {
    source.value.url = "http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}";
    source.value.projection = "EPSG:3395";
  } else {
    source.value.url = "http://seamap.ehanghai.cn/map/mapGet/mapFil/{z}/{y}/{x}.png?tk=frlipf2qddguww68";
    source.value.projection = "EPSG:3857";
  }
};
const layerStyle: VectorLayerOptions["layerStyle"] = {
  "text-value": ["get", "name"],
  "text-fill-color": "white",
  "text-background-fill-color": "orange",
  "text-offset-y": 28,
  "text-padding": [2, 8, 2, 8],
  "icon-src": cluster2,
};
let geojson = ref<GeoJSON>({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [118.11022, 24.490474],
      },
      properties: {
        name: "测试点",
      },
    },
  ],
});
</script>

<template>
  <ol-map class="map-container" :view="view">
    <select v-model="tileType" class="tile-type-selections" @change="handleSelect">
      <option v-for="item in tileTypeList" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>

    <ol-tile tile-type="XYZ" :source="source" :z-index="1"></ol-tile>
    <ol-tile v-if="tileType === 'ocean-land'" tile-type="TDT" :z-index="0"></ol-tile>
    <ol-vector :layer-style="layerStyle" :z-index="2">
      <ol-feature :geo-json="geojson"></ol-feature>
    </ol-vector>
  </ol-map>
</template>

<style scoped>
.map-container {
  position: relative;
}
.tile-type-selections {
  position: absolute;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5em;
}
</style>
