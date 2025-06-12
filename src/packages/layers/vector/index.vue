<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import { nanoid } from "nanoid";
import VectorLayer, { Options as LayerOptions } from "ol/layer/Vector";
import { createDefaultStyle, DefaultStyle } from "ol/style/flat";
import OlMap from "@/packages/lib";
import useBaseLayer from "@/packages/layers/baseLayer";
import { VectorLayerOptions } from "@/packages/types/Vector";
import useVectorLayer, { type VectorEmitsFnType } from "@/packages/hooks/vector.ts";
import { useParent } from "@/packages/hooks/parent.ts";

defineOptions({
  name: "OlVector",
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
let layer = shallowRef<VectorLayer>();
let layerReady = ref(false);
const { addLayer } = useParent();

const emits = defineEmits<VectorEmitsFnType>();
const { initVectorLayer, dispose, getFeatureById, removeFeatureById, getSource } = useVectorLayer(props, emits);

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
  const layerId = props.layerId || `vector-layer-${nanoid()}`;
  vectorLayer.set("id", layerId);
  layerReady.value = true;
  layer.value = vectorLayer;
  addLayer(layer.value);
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
