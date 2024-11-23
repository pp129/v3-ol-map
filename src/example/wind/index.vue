<script setup lang="ts">
import { FieldOptions, OlWindInstance, WindLayer, WindLayerEvent, WindOptions } from "@/packages";
import { onBeforeMount, ref, shallowRef } from "vue";

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
const handleClick = (e: WindLayerEvent) => {
  console.log(e.data);
  const data = windLayer.value?.getData();
  console.log(data);
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
  <ol-map>
    <ol-tile tile-type="OSM" :source="osm"></ol-tile>
    <ol-wind
      v-if="load"
      ref="windLayer"
      :data="data"
      :wind-options="windOptions"
      :field-options="fieldOptions"
      :visible="true"
      @mount="onLayerMount"
      @singleclick="handleClick"
    ></ol-wind>
  </ol-map>
</template>
