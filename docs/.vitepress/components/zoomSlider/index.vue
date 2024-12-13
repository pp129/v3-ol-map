<script setup lang="ts">
import { OlMap, OlTile, OlZoomSlider } from "v3-ol-map";

const controls = {
  zoom: true,
};
</script>

<template>
  <ol-map target="zoomSlider" :controls="controls">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-zoom-slider></ol-zoom-slider>
  </ol-map>
</template>
