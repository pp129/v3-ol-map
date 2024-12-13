<script setup lang="ts">
import { OlConfig, OlMap, OlTile } from "v3-ol-map";

const config = {
  tdt: {
    ak: "316cf152e80bd8a121b23746a5803c8b",
  },
};
</script>

<template>
  <!-- 组件形式注入，优先级高于全局设置 -->
  <ol-config :tdt="config.tdt">
    <ol-map target="map1" class="map">
      <ol-tile tile-type="TDT"></ol-tile>
    </ol-map>
  </ol-config>
</template>
