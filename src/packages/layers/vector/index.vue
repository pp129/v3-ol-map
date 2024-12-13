<script setup lang="ts">
import useBaseLayer from "@/packages/layers/baseLayer";
import { nanoid } from "nanoid";
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import { createDefaultStyle } from "ol/style/flat.js";
import OlMap from "@/packages/lib";
import { ExposeVector, VectorLayerOptions } from "@/packages/types/Vector";
import VectorLayer, { Options as LayerOptions } from "ol/layer/Vector";
import { DefaultStyle } from "ol/style/flat";
import useVectorLayer from "@/packages/hooks/vector.ts";

defineOptions({
  name: "OlVector",
});

const props = withDefaults(defineProps<VectorLayerOptions>(), {
  layerId: `vector-layer-${nanoid()}`,
  visible: true,
  modify: false,
  source: undefined,
  layerStyle: () => {
    return createDefaultStyle();
  },
  featureStyle: undefined,
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<VectorLayer>();
let layerReady = ref(false);

const emit: any = defineEmits([
  "singleclick",
  "pointermove",
  "sourceready",
  "featuresloadend",
  "featuresloadstart",
  "addfeature",
  "modifyend",
  "modifystart",
  "translateend",
  "translatestart",
  "translating",
  "change",
]);

const { initVectorLayer, dispose, getFeatureById, removeFeatureById, getSource } = useVectorLayer(props, emit);

provide("ParentLayer", layer);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});

watch(
  () => props.layerStyle,
  nVal => {
    layer.value?.setStyle(nVal as LayerOptions["style"] | DefaultStyle);
  },
  {
    deep: true,
  },
);
watch(
  () => props.source,
  () => {
    layer.value?.getSource()?.clear();
    if (layer.value) map.removeLayer(layer.value);
    init();
  },
);

const init = async () => {
  const vectorLayer = await initVectorLayer();
  layerReady.value = true;
  layer.value = vectorLayer;
};

defineExpose({
  getFeatureById,
  removeFeatureById,
  getSource,
  getLayer: () => {
    return layer.value;
  },
});

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  dispose();
});
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped></style>
