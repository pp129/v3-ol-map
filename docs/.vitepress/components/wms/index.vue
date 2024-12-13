<script setup lang="ts">
import {
  OlMap,
  OlTile,
  OlImage,
  OlWms,
  OlMapEvent,
  SourceImageWMSOptions,
  VMap
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 12,
  center: [118.11022, 24.490474],
  smoothExtentConstraint: true,
  constrainResolution: true,
};
const wms: SourceImageWMSOptions = {
  url: "http://172.16.34.132:8222/geoserver/test/wms",
  params: {
    VERSION: "1.3.0",
    FORMAT: "image/png",
    STYLES: "",
    LAYERS: "test:camera_30w",
  },
  serverType: "geoserver",
  ratio: 1,
  crossOrigin: "anonymous",
};
const handleClick = (e: OlMapEvent, data: any) => {
  if (data) {
    const { features } = data;
    if (features && features.length > 0) {
      const feature = features[0];
      const { properties } = feature;
      console.log(properties);
    }
  }
};
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="TDT" :z-index="0"></ol-tile>
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
</template>
