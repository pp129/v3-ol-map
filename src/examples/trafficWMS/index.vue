<script lang="ts" setup>
import { ref } from "vue";
import { SourceImageWMSOptions, TileType, VMap } from "@/packages";
const view: VMap["view"] = {
  zoom: 13,
  center: [118.125827, 24.637526],
  projection: "EPSG:4326",
};
let tileType = ref<TileType>("AMAP");

const wms: SourceImageWMSOptions = {
  url: "/wms-api/xm/wms",
  params: {
    VERSION: "1.1.1",
    FORMAT: "image/png",
    STYLES: "",
    LAYERS: "xm:gd_route_clean",
  },
  serverType: "geoserver",
  ratio: 1,
  crossOrigin: "anonymous",
};

const handleClick = () => {};
</script>

<template>
  <div class="traffic-example">
    <ol-map class="map-container" :view="view">
      <ol-tile :tile-type="tileType" :z-index="0"></ol-tile>
      <ol-image :z-index="1">
        <ol-wms
          :url="wms.url"
          :ratio="wms.ratio"
          :cross-origin="wms.crossOrigin"
          :params="wms.params"
          :server-type="wms.serverType"
          @singleclick="handleClick"
        ></ol-wms>
      </ol-image>
    </ol-map>
  </div>
</template>

<style scoped>
.traffic-example {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>
