<script setup lang="ts">
import { OverviewMapOptions } from "@/packages";

const overviewMapOptions: OverviewMapOptions = {
  collapseLabel: "\u00BB",
  label: "\u00AB",
  collapsed: true,
};
</script>

<template>
  <ol-map>
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-overview
      tile-type="AMAP"
      :collapse-label="overviewMapOptions.collapseLabel"
      :label="overviewMapOptions.label"
    ></ol-overview>
  </ol-map>
</template>

<style scoped></style>
