<script setup lang="ts">
import { inject, onMounted, ref, shallowRef, unref, watchEffect } from "vue";
import OlMap from "@/packages/lib";
import { MousePosition } from "ol/control";
import { MousePositionOptions } from "@/packages/types/MousePosition.ts";
import { createStringXY } from "ol/coordinate";

defineOptions({
  name: "OlMousePosition",
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const props = withDefaults(defineProps<MousePositionOptions>(), {
  coordinateFormat: 6,
});

const mousePosition = shallowRef<MousePosition>();
const mousePositionRef = ref<HTMLElement>();
const init = () => {
  mousePosition.value = new MousePosition({
    ...props,
    coordinateFormat: createStringXY(Number(props.coordinateFormat)),
  });
  map.addControl(mousePosition.value);
  mousePositionRef.value?.remove();
};

watchEffect(() => {
  if (mousePosition.value) map.removeControl(mousePosition.value);
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style>
.ol-mouse-position {
  position: absolute;
  top: 96%;
  right: 92%;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 3px;
}
</style>
