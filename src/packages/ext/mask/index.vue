<script lang="ts" setup>
import { inject, onMounted, ShallowRef, ref, watch } from "vue";
import ImageLayer from "ol/layer/Image";
import type { Layer, Tile } from "ol/layer";
import Mask from "ol-ext/filter/Mask";
import type { MaskOptions } from "@/packages/types";
import GeoJSON from "ol/format/GeoJSON.js";
import type FeatureLike from "ol/Feature";

defineOptions({
  name: "OlMask",
});

const layer = inject("ParentTileLayer") as ShallowRef<ImageLayer<import("ol/source/Image.js").default> | Tile | Layer>;

const props = withDefaults(defineProps<MaskOptions>(), {});
const feature = ref<FeatureLike>();

const init = () => {
  if (layer.value) {
    // 如果已经存在遮罩，先移除
    const filters = layer.value.getFilters();
    if (filters && filters.length) {
      filters.forEach(filter => {
        layer.value.removeFilter(filter);
      });
    }

    if (props.feature) {
      feature.value = new GeoJSON().readFeature(props.feature) as FeatureLike;
      const mask = new Mask({
        ...props,
        feature: feature.value,
      });

      layer.value.addFilter(mask);
    }
  }
};

// 监听props.feature的变化，重新加载遮罩
watch(
  () => props.feature,
  () => {
    init();
  },
  { deep: true },
);

onMounted(() => {
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
