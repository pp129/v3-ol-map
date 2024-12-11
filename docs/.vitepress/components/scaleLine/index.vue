<script setup lang="ts">
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
