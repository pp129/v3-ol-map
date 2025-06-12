<script lang="ts" setup>
import { BaseTileProps } from "@/packages/types";
import { Tile } from "ol/layer";
import { onMounted, shallowRef } from "vue";
import { tempTileRender } from "./tileRender";

const props = withDefaults(defineProps<BaseTileProps>(), {});
const layer = shallowRef<Tile>();
const init = () => {
  layer.value = tempTileRender(props);
};
onMounted(() => {
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
