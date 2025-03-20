<script setup lang="ts"></script>

<template>
  <div class="container">
    <ol-map>
      <ol-tile tile-type="BAIDU"></ol-tile>
    </ol-map>
    <ol-map>
      <ol-tile tile-type="BAIDU"></ol-tile>
    </ol-map>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
