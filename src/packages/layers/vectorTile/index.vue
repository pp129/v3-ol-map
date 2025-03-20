<script setup lang="ts">
import { inject, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import useBaseLayer from "@/packages/layers/baseLayer";
import VectorTileSource from "ol/source/VectorTile";
import VectorTileLayer from "ol/layer/VectorTile";
import { nanoid } from "nanoid";
import OlMap from "@/packages/lib";
import { VectorTileOptions } from "@/packages";

defineOptions({
  name: "OlVectorTile",
});

const props = withDefaults(defineProps<VectorTileOptions>(), {
  layerId: "",
  visible: true,
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layerReady = ref(false);
let layer = shallowRef<VectorTileLayer>();
let source = shallowRef<VectorTileSource>();
provide("ParentLayer", layer);
watchEffect(() => {
  useBaseLayer(layer.value, props);
});
watch(
  () => props.source,
  () => {
    source.value = new VectorTileSource({
      ...props.source,
    });
    if (layer.value) layer.value.setSource(source.value);
  },
);
const emit: any = defineEmits(["singleclick", "pointermove", "sourceready"]);
const init = () => {
  console.log(props);
  source.value = new VectorTileSource({
    ...props.source,
  });
  layer.value = new VectorTileLayer({
    ...props,
    source: source.value,
    style: props.layerStyle,
  });
  const layerId = props.layerId || `vectorTile-layer-${nanoid()}`;
  layer.value.set("id", layerId);
  layerReady.value = true;
  map.addLayer(layer.value);
  emit("sourceready", source.value);
};

onMounted(() => {
  init();
});

defineExpose({
  getSource: () => {
    return source.value;
  },
  getLayer: () => {
    return layer.value;
  },
});
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped></style>
