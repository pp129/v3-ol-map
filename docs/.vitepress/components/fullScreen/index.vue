<script setup lang="ts">
import { OlMap, OlTile, OlFullScreen } from "v3-ol-map";

const controls = {
  zoom: true,
};
</script>

<template>
  <ol-map target="fullScreen" :controls="controls">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-full-screen></ol-full-screen>
  </ol-map>
</template>
