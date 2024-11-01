<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useTileLayer from "./useTile";
import { nanoid } from "nanoid";
import type { BaseTileProps } from "@/packages/types/Tile";

const props = withDefaults(defineProps<BaseTileProps>(), {
  // tileType: "TDT",
  layerId: `tile-layer-${nanoid()}`,
  visible: true,
  source: undefined,
});
const { init, resetTile } = useTileLayer(props);
let render = ref(false);
watch(
  () => props.tileType,
  (nVal, oVal) => {
    if (nVal && oVal && nVal.toUpperCase() !== oVal.toUpperCase()) {
      resetTile();
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
      resetTile();
    }
  },
  {
    deep: true,
    immediate: false,
  },
);
onMounted(() => {
  init().then(() => {
    render.value = true;
  });
});
</script>

<template>
  <slot v-if="render"></slot>
</template>

<style scoped></style>
