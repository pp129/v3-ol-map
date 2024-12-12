<script setup lang="ts">
import { inject, onMounted, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { ScaleLine } from "ol/control";
import { ScaleLineOptions } from "@/packages";

defineOptions({
  name: "OlScaleLine",
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const props = withDefaults(defineProps<ScaleLineOptions>(), {});
const scaleLine = shallowRef<ScaleLine>();

const init = () => {
  scaleLine.value = new ScaleLine({
    ...props,
  });
  map.addControl(scaleLine.value);
};

watchEffect(() => {
  if (scaleLine.value) map.removeControl(scaleLine.value);
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
