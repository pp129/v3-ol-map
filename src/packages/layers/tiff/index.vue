<script setup lang="ts">
import { inject, onMounted, unref, watchEffect } from "vue";
import useBaseLayer, { BaseLayerOptions } from "@/packages/layers/baseLayer";
import { nanoid } from "nanoid";
import { GeoTIFF } from "ol/source";
import GeoTIFFLayer from "ol/layer/WebGLTile";
import { WebGLTileOptions } from "@/packages/types/Tile";
import OlMap from "@/packages/lib";
import { useParent } from "@/packages/hooks/parent.ts";
const { addLayer } = useParent();

defineOptions({
  name: "OlTiff",
});

const props = withDefaults(defineProps<WebGLTileOptions>(), {
  layerId: "",
  visible: true,
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const source = new GeoTIFF(props.source);
const layer = new GeoTIFFLayer({
  ...props,
  source,
});

watchEffect(() => {
  useBaseLayer(layer, props as BaseLayerOptions);
});

// console.log(baseLayer.props);
onMounted(() => {
  const layerId = props.layerId || `tile-layer-${nanoid()}`;
  layer.set("id", layerId);
  // map.addLayer(layer);
  addLayer(layer);
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
