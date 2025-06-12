<script lang="ts" setup>
import GroupLayer from "../group/index.vue";
import TileLayer from "./TileLayer.vue";
</script>

<template>
  <group-layer>
    <tile-layer :tile-type="'TDT'" />
  </group-layer>
</template>

<style scoped></style>
