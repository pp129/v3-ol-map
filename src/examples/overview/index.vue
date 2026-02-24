<script setup lang="ts">
import { OverviewMapOptions, TileType } from "@/packages";
import { ref } from "vue";

const overviewMapOptions: OverviewMapOptions = {
  collapseLabel: "\u00BB",
  label: "\u00AB",
  collapsed: true,
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
];
</script>

<template>
  <ol-map class="map-container">
    <select v-model="tileType" class="tile-type-selections">
      <option v-for="item in tileTypeList" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <ol-tile :tile-type="tileType"></ol-tile>
    <ol-overview
      :tile-type="tileType"
      :collapse-label="overviewMapOptions.collapseLabel"
      :label="overviewMapOptions.label"
      class-name="ol-overviewmap ol-custom-overviewmap"
    ></ol-overview>
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
:deep(.ol-custom-overviewmap),
:deep(.ol-custom-overviewmap.ol-uncollapsible) {
  bottom: auto;
  left: auto;
  right: 0;
  top: 0;
}

:deep(.ol-custom-overviewmap:not(.ol-collapsed)) {
  border: 1px solid black;
}

:deep(.ol-custom-overviewmap .ol-overviewmap-map) {
  border: none;
  width: 300px;
}

:deep(.ol-custom-overviewmap .ol-overviewmap-box) {
  border: 2px solid red;
}

:deep(.ol-custom-overviewmap:not(.ol-collapsed) button) {
  bottom: auto;
  left: auto;
  right: 1px;
  top: 1px;
}
</style>
