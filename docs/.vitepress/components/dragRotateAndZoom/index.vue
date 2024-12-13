<script setup lang="ts">
import { VMap, OlMap, OlTile, OlDragRoateAndZoom } from "v3-ol-map";

const controls: VMap["controls"] = {
  zoom: true,
  rotate: true,
};
const rotate = -Math.PI / 8;
</script>

<template>
  <ol-map :controls="controls" :view="{ rotation: rotate }">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-drag-rotate-and-zoom></ol-drag-rotate-and-zoom>
  </ol-map>
</template>
