<script setup lang="ts">
import { onMounted, watchEffect } from "vue";
import { nanoid } from "nanoid";
import useTileLayer from "../../layers/tile/useTile";
import { OverviewMapOptions } from "@/packages";

defineOptions({
  name: "OlOverview",
});

const props = withDefaults(defineProps<OverviewMapOptions>(), {
  tileType: "TDT",
  layerId: `tile-layer-${nanoid()}`,
  visible: true,
  collapsed: false,
  collapsible: true,
});

const { init, setOverviewMapOptions, resetOverviewMap } = useTileLayer(props);

watchEffect(() => {
  resetOverviewMap();
});

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
