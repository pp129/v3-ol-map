<script setup lang="ts">
import { onMounted } from "vue";
import { nanoid } from "nanoid";
import useTileLayer from "@/packages/layers/tile/useTile";
import { OverviewMapOptions } from "@/packages/types/Overview";

const props = withDefaults(defineProps<OverviewMapOptions>(), {
  tileType: "TDT",
  layerId: `tile-layer-${nanoid()}`,
  visible: true,
  collapsed: false,
  collapsible: true,
});

const { init, setOverviewMapOptions } = useTileLayer(props);

onMounted(() => {
  setOverviewMapOptions({
    ...props,
  }).then(() => {
    init(true);
  });
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
