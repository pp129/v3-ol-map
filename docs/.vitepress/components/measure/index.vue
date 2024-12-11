<script setup lang="ts">
import { ref } from "vue";
import { MeasureType, OlMeasureInstance } from "v3-ol-map";

let measureType = ref<MeasureType>("");
const measureTypeOptions = ["length", "area"];
const olMeasureRef = ref<OlMeasureInstance>();
const clear = () => {
  olMeasureRef.value?.clear();
};
let active = ref(true);
const setActive = () => {
  active.value = !active.value;
  olMeasureRef.value?.setActive(active.value);
};
const handleChange = () => {
  active.value = true;
}
</script>

<template>
  <ol-map class="map-container">
    <select v-model="measureType" class="draw-types" @change="handleChange">
      <option value="">请选择</option>
      <option v-for="type in measureTypeOptions" :key="type" :value="type">{{ type }}</option>
    </select>
    <button class="draw-clear" @click="clear">清除</button>
    <button class="draw-active" @click="setActive">{{ active ? "停止测量" : "恢复测量" }}</button>
    <ol-vector>
      <ol-measure ref="olMeasureRef" :type="measureType" :clear-previous="true" :show-segments="true"></ol-measure>
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
