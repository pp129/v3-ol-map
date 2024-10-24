<script setup lang="ts">
import { OlMapEvent, SourceWMS } from "@/packages";

const wms: SourceWMS = {
  url: "http://218.5.80.6:6600/geoserver/nd/wms",
  params: {
    VERSION: "1.1.1",
    FORMAT: "image/png",
    STYLES: "",
    LAYERS: "nd:nd_layer",
    TILED: true,
  },
  serverType: "geoserver",
};

const handleClick = (e: OlMapEvent, data: any) => {
  console.log(data);
};
</script>

<template>
  <ol-map>
    <ol-tile>
      <ol-wms :url="wms.url" :params="wms.params" :server-type="wms.serverType" @singleclick="handleClick"></ol-wms>
    </ol-tile>
  </ol-map>
</template>

<style scoped></style>
