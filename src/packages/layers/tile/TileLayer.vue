<script lang="ts" setup>
import { BaseTileProps } from "@/packages/types";
import { useParent } from "@/packages/hooks/parent";
import { useTile } from "@/packages/hooks/tile.ts";

const props = withDefaults(defineProps<BaseTileProps>(), {
  layerId: "",
  visible: true,
});

const { getLayer } = useTile(props);
const layer = getLayer();
const { addLayer } = useParent();
if (layer) addLayer(layer);
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
