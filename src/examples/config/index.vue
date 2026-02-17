<script setup lang="ts">
import { OlMap, OlTile, OlConfig } from "v3-ol-map";
const config = {
  tdt: {
    ak: "316cf152e80bd8a121b23746a5803c8b",
  },
};
</script>

<template>
  <div class="container">
    <!-- 组件形式注入，优先级高于全局设置 -->
    <ol-config :tdt="config.tdt">
      <ol-map target="map1" class="map" width="50%">
        <ol-tile tile-type="TDT"></ol-tile>
      </ol-map>
    </ol-config>
    <!-- 在main中设置的全局变量-->
    <ol-map target="map2" class="map" width="50%">
      <ol-tile></ol-tile>
    </ol-map>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  height: 100vh;
}
</style>
