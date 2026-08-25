<script setup lang="ts">
import { inject, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { DragRotateAndZoom } from "ol/interaction";
import { DragRotateAndZoomOptions } from "@/packages/types/DragRotateAndZoom.ts";
import { useDisposables } from "@/packages/hooks/disposables";

defineOptions({
  name: "OlDragRotateAndZoom",
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const { addDisposable } = useDisposables();
const props = withDefaults(defineProps<DragRotateAndZoomOptions>(), {});
const dragRotateAndZoom = shallowRef<DragRotateAndZoom>();
const init = () => {
  dragRotateAndZoom.value = new DragRotateAndZoom(props);
  const interaction = dragRotateAndZoom.value;
  map.addInteraction(interaction);
  addDisposable(() => map.removeInteraction(interaction));
};
watchEffect(() => {
  if (dragRotateAndZoom.value) map.removeInteraction(dragRotateAndZoom.value);
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
