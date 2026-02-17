<script setup lang="ts">
import { inject, onMounted, provide, ref, shallowRef, unref, watchEffect } from "vue";
import { ImageLayerOptions } from "@/packages/types/Tile";
import { nanoid } from "nanoid";
import OlMap from "@/packages/lib";
import ImageLayer from "ol/layer/Image";
import useBaseLayer from "@/packages/layers/baseLayer";
import { useParent } from "@/packages/hooks/parent.ts";

defineOptions({
  name: "OlImage",
});

const props = withDefaults(defineProps<ImageLayerOptions>(), {
  layerId: `image-layer-${nanoid()}`,
  visible: true,
  source: () => {
    return {
      url: "",
      crossOrigin: "",
      projection: "EPSG:4326",
      imageExtent: [0, 0, 180, 90],
    };
  },
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<any>();

let render = ref(false);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});

const { addLayer } = useParent();

onMounted(() => {
  layer.value = new ImageLayer({
    ...props,
    source: undefined,
  });
  layer.value.set("layerTypeName", "ImageLayer");
  provide("ParentTileLayer", layer);
  // map.addLayer(layer.value);
  addLayer(layer.value);
  render.value = true;
});
</script>

<template>
  <slot v-if="render"></slot>
</template>

<style scoped lang="scss"></style>
