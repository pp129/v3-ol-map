<script setup lang="ts">
import { OlMap, OlTile, OlScaleLine } from "v3-ol-map";

const controls = {
  zoom: true,
};
</script>

<template>
  <ol-map target="scaleLine" :controls="controls">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-scale-line></ol-scale-line>
  </ol-map>
</template>
