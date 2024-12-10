<script setup lang="ts">
import { Ref, ref } from "vue";
import { SourceOptions, TileType, VMap } from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
};
let tileType = ref<TileType>("AMAP");
type TileTypeList = {
  value: TileType;
  label: string;
};
const tileTypeList: TileTypeList[] = [
  { value: "AMAP", label: "高德地图" },
  { value: "AMAP_SATELLITE", label: "高德地图-卫星图" },
  { value: "BAIDU", label: "百度地图" },
  { value: "BAIDU_SATELLITE", label: "百度地图-卫星图" },
  { value: "TDT", label: "天地图" },
  { value: "TDT_SATELLITE", label: "天地图-卫星图" },
  { value: "TDT_TERRAIN", label: "天地图-地形图" },
  { value: "XYZ", label: "自定义路径的栅格图层" },
];
const xyz: SourceOptions = {
  url: "http://172.16.34.120:6080/arcgis/rest/services/xiamen/MapServer/tile/{z}/{y}/{x}",
  projection: "EPSG:4326",
};
let source = ref<Ref<SourceOptions> | undefined>(undefined);
const handleSelect = () => {
  if (tileType.value === "XYZ") {
    source.value = { ...xyz };
  } else {
    source.value = undefined;
  }
};
</script>

<template>
  <ol-map target="base" class="map-container" :view="view">
    <select v-model="tileType" class="tile-type-selections" @change="handleSelect">
      <option v-for="item in tileTypeList" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <ol-tile :tile-type="tileType" :source="source"></ol-tile>
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
