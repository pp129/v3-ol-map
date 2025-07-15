<script setup lang="ts">
import { ref } from "vue";
import { DrawType, OlDrawInstance, VectorLayerOptions, DrawEvent, Point } from "@/packages";

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
const isOnce = ref(false);
const toggleOnce = () => {
  isOnce.value = !isOnce.value;
};
let active = ref(true);
const setActive = () => {
  active.value = !active.value;
  olDrawRef.value?.setActive(active.value);
};
const handleDrawend = (args: DrawEvent) => {
  console.log(args);
  const feature = args.feature;
  if (feature) {
    if (drawType.value === "Point") {
      const geometry = feature.getGeometry() as Point;
      const coordinates = geometry!.getCoordinates();
      console.log(coordinates);
    }
  }
};
</script>

<template>
  <ol-map class="map-container">
    <select v-model="drawType" class="draw-types">
      <option value="">请选择</option>
      <option v-for="type in drawTypes" :key="type" :value="type">{{ type }}</option>
    </select>
    <button class="draw-once" @click="toggleOnce">{{ isOnce ? "多次绘制" : "单次绘制" }}</button>
    <button class="draw-clear" @click="clear">清除</button>
    <button class="draw-active" @click="setActive">{{ active ? "停止绘制" : "恢复绘制" }}</button>
    <ol-vector :layer-style="drawStyle" :source="{ wrapX: false }">
      <ol-draw
        ref="olDrawRef"
        :snap="true"
        :modify="true"
        :type="drawType"
        :once="isOnce"
        :options="{ maxPoints: 5 }"
        @drawend="handleDrawend"
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
.draw-once {
  position: absolute;
  top: 10px;
  left: calc(50% + 100px);
  z-index: 1000;
}
.draw-clear {
  position: absolute;
  top: 10px;
  left: calc(50% + 220px);
  z-index: 1000;
}
.draw-active {
  position: absolute;
  top: 10px;
  left: calc(50% + 310px);
  z-index: 1000;
}
</style>
