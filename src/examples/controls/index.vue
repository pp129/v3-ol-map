<script setup lang="ts">
import { OverviewMapOptions } from "@/packages";

const overviewMapOptions: OverviewMapOptions = {
  collapseLabel: "\u00BB",
  label: "\u00AB",
  collapsed: true,
};
const controls = {
  zoom: true,
};
</script>

<template>
  <ol-map :controls="controls">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-overview
      tile-type="AMAP"
      :collapse-label="overviewMapOptions.collapseLabel"
      :label="overviewMapOptions.label"
    ></ol-overview>
    <ol-zoom-slider></ol-zoom-slider>
    <ol-full-screen></ol-full-screen>
    <ol-scale-line></ol-scale-line>
  </ol-map>
</template>

<style>
.ol-overviewmap {
  bottom: 50px;
  left: 10px;
  right: auto;
  top: auto;
}
</style>
