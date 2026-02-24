<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import useTileLayer from "./useTile";
import type { BaseTileProps, TileLayerEmitFnType } from "@/packages/types/Tile";

defineOptions({
  name: "OlTile",
});

const props = withDefaults(defineProps<BaseTileProps>(), {
  layerId: "",
  visible: true,
  source: undefined,
});
const emit = defineEmits<TileLayerEmitFnType>();
const { init, resetTile, getLayer, clearTile } = useTileLayer(props, emit);
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
