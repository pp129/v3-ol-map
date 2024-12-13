<script setup lang="ts">
import { Ref, ref } from "vue";
import { OlMap, OlTile, SourceXYZ, VMap } from "v3-ol-map";

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
</script>

<template>
  <ol-map target="ocean" class="map-container" :view="view">
    <select v-model="tileType" class="tile-type-selections" @change="handleSelect">
      <option v-for="item in tileTypeList" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <ol-tile tile-type="XYZ" :source="source" :z-index="1"></ol-tile>
    <ol-tile v-if="tileType === 'ocean-land'" tile-type="TDT" :z-index="0"></ol-tile>
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
