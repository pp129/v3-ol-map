<script setup lang="ts">
import { onBeforeMount, Reactive, reactive, ref, shallowRef } from "vue";
import {
  OlMap,
  OlTile,
  OlWind,
  OlOverlay,
  FieldOptions, OlWindInstance, Position, WindLayer, WindLayerEvent, WindOptions, WindData } from "v3-ol-map";

const windLayer = shallowRef<OlWindInstance>();
let data = ref();
let load = ref(false);
const windOptions: WindOptions = {
  velocityScale: 1 / 20,
  paths: 5000,
  colorScale: [
    "rgb(36,104, 180)",
    "rgb(60,157, 194)",
    "rgb(128,205,193 )",
    "rgb(151,218,168 )",
    "rgb(198,231,181)",
    "rgb(238,247,217)",
    "rgb(255,238,159)",
    "rgb(252,217,125)",
    "rgb(255,182,100)",
    "rgb(252,150,75)",
    "rgb(250,112,52)",
    "rgb(245,64,32)",
    "rgb(237,45,28)",
    "rgb(220,24,32)",
    "rgb(180,0,35)",
  ],
  lineWidth: 2,
};
const fieldOptions: FieldOptions = {
  wrapX: true,
  // flipY: true,
};
const osm = {
  url: "//{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
};
const onLayerMount = (layer: WindLayer) => {
  console.log("onLayerMount", layer);
};
let position = ref<Position>();
type Info = Reactive<Partial<WindData>>;
let windowInfo = <Info>reactive({
  m: 0,
  windLevel: "",
  windDirection: "",
});
const handleMove = (e: WindLayerEvent) => {
  const windData = e.data;
  const data = windLayer.value?.getData();
  console.log(data);
  windowInfo = {
    m: windData?.m,
    windLevel: windData?.windLevel,
    windDirection: windData?.windDirection,
  };
  position.value = e.coordinate;
};
onBeforeMount(async () => {
  data.value = await fetch("https://blog.sakitam.com/wind-layer/data/wind.json")
    .then(res => {
      return res.json();
    })
    .then(data => {
      load.value = true;
      return data;
    });
});
</script>

<template>
  <ol-map :view="{zoom: 3}">
    <ol-tile tile-type="OSM" :source="osm"></ol-tile>
    <ol-wind
      v-if="load"
      ref="windLayer"
      :data="data"
      :wind-options="windOptions"
      :field-options="fieldOptions"
      :visible="true"
      @mount="onLayerMount"
      @pointermove="handleMove"
    ></ol-wind>
    <ol-overlay :position="position" :class="['overlay']" positioning="bottom-center" :offset="[0, -20]">
      <div class="content">
        风速：{{ windowInfo.m }}
        <br />
        风级：{{ windowInfo.windLevel }}
        <br />
        风向：{{ windowInfo.windDirection }}
      </div>
    </ol-overlay>
  </ol-map>
</template>

<style scoped>
.overlay {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}
.overlay .content {
  z-index: 1;
}
</style>
