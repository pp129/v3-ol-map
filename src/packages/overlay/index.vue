<script setup lang="ts">
import { nanoid } from "nanoid";
import { inject, onMounted, shallowRef, unref, watch } from "vue";
import { Overlay } from "ol";
import OlMap from "@/packages/lib";
import type { OverlayOptions } from "@/packages/types/Overlay";
import type { Options } from "ol/Overlay";

defineOptions({
  name: "OlOverlay",
});

const props = withDefaults(defineProps<OverlayOptions>(), {
  overlayId: "",
  data: () => {
    return {};
  },
  offset: () => {
    return [0, 0]; // 一定要加这个默认值，不然ol会报错
  },
  position: undefined,
});
let overlay = shallowRef();
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const emit: any = defineEmits(["load"]);
const elmId = `overlay-el-${nanoid()}`;
watch(
  () => props.position,
  position => {
    overlay.value.setPosition(position);
  },
  { deep: true, immediate: false },
);
const init = () => {
  let element = props.element ? props.element : document.getElementById(elmId.toString());
  const id = props.overlayId || `overlay-${nanoid()}`;
  const overlayOption = { ...props, ...{ id, element } };
  overlay.value = new Overlay(overlayOption as Options);
  const options = { ...overlayOption } as any;
  for (const i in options) {
    if (Object.prototype.hasOwnProperty.call(options, i)) {
      overlay.value.set(i, options[i]);
    }
  }
  map.addOverlay(overlay.value);
  emit("load", overlay.value, map);
};
onMounted(() => {
  init();
});
</script>

<template>
  <div :id="elmId" ref="overlayRef" v-bind="$attrs">
    <slot :data="data"></slot>
  </div>
</template>

<style scoped lang="scss"></style>
