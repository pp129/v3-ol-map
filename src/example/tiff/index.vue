<script setup lang="ts">
import { VMap, WebGLTileOptions } from "@/packages";

const view: VMap["view"] = {
  zoom: 16,
  center: [118.06947316152419, 24.45668079192249],
};

const GeoTIFF: WebGLTileOptions["source"] = {
  projection: "EPSG:4548",
  // normalize: false,
  sources: [
    {
      url: "http://172.16.34.132:5000/ljd/result.tif",
      overviews: ["http://172.16.34.132:5000/ljd/result.tif.ovr"],
      // nodata: 0,
    },
  ],
};
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="TDT_SATELLITE"></ol-tile>
    <ol-tiff :source="GeoTIFF"></ol-tiff>
  </ol-map>
</template>

<style scoped></style>
