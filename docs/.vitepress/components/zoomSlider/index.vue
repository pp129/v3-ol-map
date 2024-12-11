<script setup lang="ts">
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
