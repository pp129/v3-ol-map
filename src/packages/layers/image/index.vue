<script setup lang="ts">
import { onMounted, provide, ref, shallowRef, watchEffect } from "vue";
import { ImageLayerOptions, TileLayerEmitFnType } from "@/packages/types/Tile";
import { nanoid } from "nanoid";
import ImageLayer from "ol/layer/Image";
import useBaseLayer from "@/packages/layers/baseLayer";
import { useParent } from "@/packages/hooks/parent.ts";
import { BaseEvent, ObjectEvent } from "@/packages";

defineOptions({
  name: "OlImage",
});

const props = withDefaults(defineProps<ImageLayerOptions>(), {
  layerId: "",
  visible: true,
  source: () => {
    return {
      url: "",
      crossOrigin: "",
      projection: "EPSG:4326",
      imageExtent: [0, 0, 180, 90],
    };
  },
});

let layer = shallowRef<any>();

const emit = defineEmits<TileLayerEmitFnType>();

let render = ref(false);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});

const { addLayer } = useParent();

onMounted(() => {
  const layerId = props.layerId || `image-layer-${nanoid()}`;
  layer.value = new ImageLayer({
    ...props,
    source: undefined,
  });
  layer.value.set("id", layerId);
  layer.value.set("layerTypeName", "ImageLayer");
  layer.value.on("sourceready", (e: BaseEvent) => {
    emit("sourceready", e);
  });
  layer.value.on("change:visible", (e: ObjectEvent) => {
    emit("change:visible", e);
  });
  provide("ParentTileLayer", layer);
  addLayer(layer.value);
  render.value = true;
});
</script>

<template>
  <slot v-if="render"></slot>
</template>

<style scoped lang="scss"></style>
