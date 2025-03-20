<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import useTileLayer from "./useTile";
import { nanoid } from "nanoid";
import type { BaseTileProps } from "@/packages/types/Tile";

defineOptions({
  name: "OlTile",
});

const props = withDefaults(defineProps<BaseTileProps>(), {
  // tileType: "TDT",
  layerId: "",
  visible: true,
  source: undefined,
});
const { init, resetTile, getLayer, clearTile } = useTileLayer(props);
let render = ref(false);
watch(
  () => props.tileType,
  (nVal, oVal) => {
    if (nVal && oVal && nVal.toUpperCase() !== oVal.toUpperCase()) {
      const layer = getLayer();
      if (layer) {
        resetTile(layer);
      }
    }
  },
  {
    deep: true,
    immediate: false,
  },
);
watch(
  () => props.source,
  nVal => {
    if (nVal && props.tileType) {
      const layer = getLayer();
      if (layer) resetTile(layer);
    }
  },
  {
    deep: true,
    immediate: false,
  },
);
onMounted(() => {
  init().then(() => {
    const layer = getLayer();
    if (layer) {
      const layerId = props.layerId || `tile-layer-${nanoid()}`;
      layer.set("id", layerId);
      render.value = true;
    }
  });
});
onUnmounted(() => {
  clearTile();
});
</script>

<template>
  <slot v-if="render"></slot>
</template>

<style scoped></style>
