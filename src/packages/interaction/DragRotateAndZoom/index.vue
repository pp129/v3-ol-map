<script setup lang="ts">
import { inject, onMounted, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { DragRotateAndZoom } from "ol/interaction";
import { DragRotateAndZoomOptions } from "@/packages/types/DragRotateAndZoom.ts";

defineOptions({
  name: "OlDragRotateAndZoom",
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const props = withDefaults(defineProps<DragRotateAndZoomOptions>(), {});
const dragRotateAndZoom = shallowRef<DragRotateAndZoom>();
const init = () => {
  dragRotateAndZoom.value = new DragRotateAndZoom(props);
  map.addInteraction(dragRotateAndZoom.value);
};
watchEffect(() => {
  if (dragRotateAndZoom.value) map.removeInteraction(dragRotateAndZoom.value);
  init();
});

onMounted(() => {
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
