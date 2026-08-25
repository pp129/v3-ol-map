<script setup lang="ts">
import { inject, onMounted, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { ZoomSlider } from "ol/control";
import { ZoomSliderOptions } from "@/packages/types/ZoomSlider.ts";
import { useDisposables } from "@/packages/hooks/disposables";

defineOptions({
  name: "OlZoomSlider",
});

const props = withDefaults(defineProps<ZoomSliderOptions>(), {});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const { addDisposable } = useDisposables();

const zoomSlider = shallowRef<ZoomSlider>();

const init = () => {
  zoomSlider.value = new ZoomSlider({
    ...props,
  });
  const control = zoomSlider.value;
  map.addControl(control);
  addDisposable(() => map.removeControl(control));
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
