<script lang="ts" setup>
import { ref } from "vue";
import { SourceImageWMSOptions, TileType, VMap, MapBrowserEvent, ObjectEvent } from "@/packages";
const view: VMap["view"] = {
  zoom: 13,
  center: [118.125827, 24.637526],
  projection: "EPSG:4326",
};
let tileType = ref<TileType>("AMAP");

const wms = ref<SourceImageWMSOptions>({
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
});

const visible = ref(true);
const filter = ref<boolean>(false);

const handleClick = (e: MapBrowserEvent, data: any) => {
  console.log(data);
  filter.value = !filter.value;
  wms.value.params.CQL_FILTER = filter.value ? `state in (2,3,4)` : ``;
};

const handlePointerMove = (e: MapBrowserEvent, data: any) => {
  if (data.numberReturned > 0) {
    console.log(data.features);
    console.log(e);
  }
};

const handleSourceReady = () => {
  wms.value.params.TIME = new Date().getTime();
  setInterval(() => {
    wms.value.params.TIME = new Date().getTime();
  }, 10000);
};
const handleChangeVisible = (evt: ObjectEvent) => {
  console.log("handleChangeVisible", evt.target.get("visible"));
};
</script>

<template>
  <div class="traffic-example">
    <button class="change-visible-btn" @click="visible = !visible">change visible</button>
    <ol-map class="map-container" :view="view">
      <ol-tile :tile-type="tileType" :z-index="0"></ol-tile>
      <ol-image :visible="visible" :z-index="1" @sourceready="handleSourceReady" @change:visible="handleChangeVisible">
        <ol-wms
          :url="wms.url"
          :ratio="wms.ratio"
          :cross-origin="wms.crossOrigin"
          :params="wms.params"
          :server-type="wms.serverType"
          @dblclick="handleClick"
          @pointermove="handlePointerMove"
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

.change-visible-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>
