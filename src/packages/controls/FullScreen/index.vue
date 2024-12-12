<script setup lang="ts">
import { inject, onMounted, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { FullScreen } from "ol/control";
import { FullScreenOptions } from "@/packages";

defineOptions({
  name: "OlFullScreen",
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;

const props = withDefaults(defineProps<FullScreenOptions>(), {});

const fullScreen = shallowRef<FullScreen>();
const init = () => {
  fullScreen.value = new FullScreen({
    ...props,
  });
  map.addControl(fullScreen.value);
};

watchEffect(() => {
  if (fullScreen.value) map.removeControl(fullScreen.value);
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
