<script lang="ts" setup>
import { inject, onMounted, provide, Ref, ref, shallowRef, unref, watchEffect } from "vue";
import { nanoid } from "nanoid";
import LayerGroup, { type Options } from "ol/layer/Group";
import OlMap from "@/packages/lib";
import useBaseLayer from "@/packages/layers/baseLayer";

defineOptions({
  name: "OlGroupLayer",
});

type GroupOptions = Partial<Options> & {
  id?: string;
};
const props = withDefaults(defineProps<GroupOptions>(), {
  id: "",
});
const VMap = inject<Ref<OlMap> | undefined>("VMap", undefined);

const layer = shallowRef<LayerGroup>();
let layerReady = ref(false);

const init = () => {
  layer.value = new LayerGroup(props);
  const layerId = props.id ?? `group-layer-${nanoid()}`;
  layer.value.set("id", layerId);
  if (VMap) {
    const map = unref(VMap).map;
    console.log(layer.value);
    map?.addLayer(layer.value);
    layerReady.value = true;
  }
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
