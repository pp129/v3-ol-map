<script setup lang="ts">
import { ref } from "vue";
import { DrawType, OlDrawInstance, VectorLayerOptions } from "v3-ol-map";

const drawStyle: VectorLayerOptions["layerStyle"] = {
  "fill-color": "rgba(255, 255, 255, 0.2)",
  "stroke-color": "#ffcc33",
  "stroke-width": 2,
  "circle-radius": 7,
  "circle-fill-color": "#ffcc33",
};
const olDrawRef = ref<OlDrawInstance>();
let drawType = ref<DrawType>("");
const drawTypes = ["Point", "LineString", "Polygon", "Circle", "Square", "Box"];
const clear = () => {
  olDrawRef.value?.clear();
};
let active = ref(true);
const setActive = () => {
  active.value = !active.value;
  olDrawRef.value?.setActive(active.value);
};
const handleChange = () => {
  active.value = true;
}
</script>

<template>
  <ol-map class="map-container">
    <select v-model="drawType" class="draw-types" @change="handleChange">
      <option value="">请选择</option>
      <option v-for="type in drawTypes" :key="type" :value="type">{{ type }}</option>
    </select>
    <button class="draw-clear" @click="clear">清除</button>
    <button class="draw-active" @click="setActive">{{ active ? "停止绘制" : "恢复绘制" }}</button>
    <ol-vector :layer-style="drawStyle" :source="{ wrapX: false }">
      <ol-draw ref="olDrawRef" :snap="true" :modify="true" :type="drawType"></ol-draw>
    </ol-vector>
  </ol-map>
</template>

<style scoped>
.map-container {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
}
.draw-types {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  padding: 0.6em 1.2em;
  font-size: 1em;
  z-index: 1000;
}
.draw-clear {
  position: absolute;
  top: 10px;
  left: calc(50% + 100px);
  z-index: 1000;
}
.draw-active {
  position: absolute;
  top: 10px;
  left: calc(50% + 200px);
  z-index: 1000;
}
</style>
