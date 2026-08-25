<script lang="ts" setup>
import { onMounted, provide, ref, shallowRef, watchEffect } from "vue";
import { nanoid } from "nanoid";
import LayerGroup, { type Options } from "ol/layer/Group";
import useBaseLayer from "@/packages/layers/baseLayer";
import { useParent } from "@/packages/hooks/parent";

defineOptions({
  name: "OlGroupLayer",
});

type GroupOptions = Partial<Options> & {
  id?: string;
};
const props = withDefaults(defineProps<GroupOptions>(), {
  id: "",
});
const { addLayer } = useParent();

const layer = shallowRef<LayerGroup>();
let layerReady = ref(false);

const init = () => {
  layer.value = new LayerGroup(props);
  const layerId = props.id ?? `group-layer-${nanoid()}`;
  layer.value.set("id", layerId);
  addLayer(layer.value);
  layerReady.value = true;
};

watchEffect(() => {
  if (layer.value) useBaseLayer(layer.value, props);
});

onMounted(() => {
  init();
});

provide("GroupLayer", layer);
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped></style>
