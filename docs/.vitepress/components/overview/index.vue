<script setup lang="ts">
import { OverviewMapOptions, OlMap, OlTile, OlOverview } from "v3-ol-map";

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
      tile-type="BAIDU"
      :collapse-label="overviewMapOptions.collapseLabel"
      :label="overviewMapOptions.label"
    ></ol-overview>
  </ol-map>
</template>
