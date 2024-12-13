<script setup lang="ts">
import { computed, onMounted, reactive, ref, shallowRef } from "vue";
import {
  OlMap,
  OlTile,
  OlPath,
  OlMapInstance,
  OlPathInstance,
  PathOptions,
  VMap
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 10,
  center: [118.11965064689637, 24.646687194131847],
};
let pathRef = shallowRef<OlPathInstance>();
let path = reactive<PathOptions>({
  path: [],
  tracePointsModePlay: "animation",
  options: {
    timeStep: 1, // skip动画的播放间隔,单位秒
    speed: 60, // animation动画播放的速度设置,单位 km/h
  },
});
let labelVisible = ref(true);
let pathVisible = ref(true);
let pathLoad = ref(true);
const pathVisibleLabel = computed(() => (pathVisible.value ? "隐藏" : "显示"));
let showPath = ref(false);
const getPathData = async () => {
  fetch("https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/public/heatmap/data-6k.json")
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      path.path = data;
      showPath.value = true;
    });
};
const togglePathVisible = () => {
  pathVisible.value = !pathVisible.value;
};
const startPath = () => {
  pathRef.value?.start();
  console.log(pathRef.value?.getStatus());
};
const pausePath = () => {
  pathRef.value?.pause();
};
const resumePath = () => {
  pathRef.value?.resume();
};
const stopPath = () => {
  pathRef.value?.stop();
};
const destroyPath = () => {
  pathRef.value?.destroy();
  pathLoad.value = false;
};
const init = () => {
  pathRef.value?.init();
};
const setLabelVisible = () => {
  labelVisible.value = !labelVisible.value;
};
const mapRef = ref<OlMapInstance>();
const onLoad = () => {
  pathLoad.value = true;
};
onMounted(() => {
  getPathData();
});
</script>

<template>
  <ol-map class="map-path" ref="mapRef" :view="view">
    <div class="path-tool">
      <button class="tool layer-visible" @click="togglePathVisible">{{ pathVisibleLabel }}</button>
      <button class="tool" @click="startPath">开始</button>
      <button class="tool" @click="pausePath">暂停</button>
      <button class="tool" @click="resumePath">继续</button>
      <button class="tool" @click="stopPath">停止</button>
      <button class="tool" @click="setLabelVisible">标签{{ labelVisible ? "隐藏" : "显示" }}</button>
      <button class="tool" @click="destroyPath">销毁</button>
      <button v-if="!pathLoad" class="tool" @click="init">重新生成</button>
    </div>
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-path
      v-if="showPath"
      ref="pathRef"
      v-bind="path"
      :visible="pathVisible"
      :label-visible="labelVisible"
      @load="onLoad"
    ></ol-path>
  </ol-map>
</template>

<style scoped>
.map-path {
  position: relative;
}
.path-tool {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.path-tool .tool {
  margin-right: 10px;
}
</style>
