<script setup lang="ts">
import { ref } from "vue";
import { DrawType, OlDrawInstance, VectorLayerOptions } from "@/packages";

const drawStyle: VectorLayerOptions["layerStyle"] = {
  "fill-color": "rgba(255, 255, 255, 0.2)",
  "stroke-color": "#ffcc33",
  "stroke-width": 2,
  "circle-radius": 7,
  "circle-fill-color": "#ffcc33",
};
let pinType = ref<DrawType>("");
const olDrawPinRef = ref<OlDrawInstance>();
const drawTypes = [
  { name: "兴趣点", value: "Point" },
  { name: "兴趣面", value: "Polygon" },
];
const clear = () => {
  olDrawPinRef.value?.clear();
  pinType.value = "";
};
const handleSavePin = () => {
  setTimeout(() => {
    pinType.value = "";
  }, 0);
};
</script>

<template>
  <ol-map class="map-container">
    <select v-model="pinType" class="draw-types">
      <option value="">请选择</option>
      <option v-for="type in drawTypes" :key="type.value" :value="type.value">{{ type.name }}</option>
    </select>
    <button class="draw-clear" @click="clear">清除</button>
    <ol-tile tile-type="AMAP" :z-index="0"></ol-tile>
    <ol-vector :source="{ wrapX: false }" :z-index="10" :layer-style="drawStyle">
      <ol-draw
        ref="olDrawPinRef"
        :snap="true"
        :modify="true"
        :type="pinType"
        :pin="true"
        pin-class="pin-light-container"
        :pin-title-class="['pin-light-title']"
        pin-body-class="pin-light-body"
        pin-footer-class="pin-light-footer"
        @savePin="handleSavePin"
      ></ol-draw>
    </ol-vector>
  </ol-map>
</template>

<style scoped>
.map-container {
  position: relative;
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
:deep(.pin-light-container) {
  width: 220px;
  border-radius: 10px;
  overflow: auto;
}
:deep(.pin-light-title) {
  padding: 10px;
  background: rgba(40, 153, 255, 0.8);
}
:deep(.pin-light-body) {
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
}
:deep(.pin-light-body .form-item) {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
:deep(.pin-light-footer) {
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(66, 66, 66, 0.8);
}
</style>
