<script setup lang="ts">
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
