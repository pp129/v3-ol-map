<script setup lang="ts">
import OlMap from "@/packages/lib";
import Map from "ol/Map";
import { WindLayer } from "ol-wind";
import { inject, onMounted, onUnmounted, shallowRef, unref, watch } from "vue";
import { WindLayerOptions } from "@/packages/types/Wind";

defineOptions({
  name: "OlWind",
});

const VMap = inject("VMap") as OlMap;
const map: Map = unref(VMap).map;
const props = withDefaults(defineProps<WindLayerOptions>(), {
  forceRender: true,
});
const layer = shallowRef<WindLayer | null>();
const emits = defineEmits(["mount"]);

const init = () => {
  console.log(props.windOptions);
  layer.value = new WindLayer(props.data, {
    windOptions: props.windOptions,
    forceRender: props.forceRender,
    fieldOptions: props.fieldOptions,
  });
  layer.value.setMap(map);
  emits("mount");
};

watch(
  () => props.data,
  newVal => {
    layer.value?.setData(newVal);
  },
  { deep: true },
);
watch(
  () => props.windOptions,
  newVal => {
    if (newVal) layer.value?.setWindOptions(newVal);
  },
  { deep: true },
);

const destroy = () => {
  map?.removeLayer(layer.value as any);
  layer.value = null;
};
const getData = () => {
  return layer.value?.getData();
};
const getWindOptions = () => {
  return layer.value?.getWindOptions();
};
defineExpose({
  getData,
  getWindOptions,
});
onMounted(() => {
  init();
});
onUnmounted(() => {
  destroy();
});
</script>

<template>
  <slot></slot>
</template>
