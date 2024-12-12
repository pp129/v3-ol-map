<script setup lang="ts">
import { inject, onMounted, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { ZoomSlider } from "ol/control";
import { ZoomSliderOptions } from "@/packages/types/ZoomSlider.ts";

defineOptions({
  name: "OlZoomSlider",
});

const props = withDefaults(defineProps<ZoomSliderOptions>(), {});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;

const zoomSlider = shallowRef<ZoomSlider>();

const init = () => {
  zoomSlider.value = new ZoomSlider({
    ...props,
  });
  map.addControl(zoomSlider.value);
};

watchEffect(() => {
  if (zoomSlider.value) map.removeControl(zoomSlider.value);
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
