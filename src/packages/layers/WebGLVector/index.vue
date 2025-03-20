<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import { VectorLayerOptions, WebGLStyle } from "@/packages";
import { nanoid } from "nanoid";
import { createDefaultStyle } from "ol/style/flat";
import useVectorLayer from "@/packages/hooks/vector.ts";
import useBaseLayer from "@/packages/layers/baseLayer";

defineOptions({
  name: "OlWebglVector",
});

const props = withDefaults(defineProps<VectorLayerOptions>(), {
  layerId: "",
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
let layer = shallowRef<WebGLVectorLayer>();
let layerReady = ref(false);

provide("ParentLayer", layer);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});

watch(
  () => props.layerStyle,
  nVal => {
    layer.value?.setStyle(nVal as WebGLStyle);
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

const { initWebglLayer, dispose, getFeatureById, removeFeatureById, getSource } = useVectorLayer(props, emit);

const init = async () => {
  const vectorLayer = await initWebglLayer();
  const layerId = props.layerId || `webgl-layer-${nanoid()}`;
  vectorLayer.set("id", layerId);
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
