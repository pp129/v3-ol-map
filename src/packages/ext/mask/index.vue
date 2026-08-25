<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ShallowRef, ref, shallowRef, watch } from "vue";
import ImageLayer from "ol/layer/Image";
import type { Layer, Tile } from "ol/layer";
import Mask from "ol-ext/filter/Mask";
import type { MaskOptions } from "@/packages/types";
import GeoJSON from "ol/format/GeoJSON.js";
import type FeatureLike from "ol/Feature";
import { Fill } from "ol/style";

defineOptions({
  name: "OlMask",
});

const layer = inject("ParentTileLayer") as ShallowRef<ImageLayer<import("ol/source/Image.js").default> | Tile | Layer>;

const props = withDefaults(defineProps<MaskOptions>(), {});
const feature = ref<FeatureLike>();
const filter = shallowRef<Mask>();

const init = () => {
  if (layer.value) {
    // 如果已经存在遮罩，先移除
    if (filter.value) layer.value.removeFilter(filter.value);

    if (props.feature) {
      feature.value = new GeoJSON().readFeature(props.feature) as FeatureLike;
      filter.value = new Mask({
        ...props,
        feature: feature.value,
        fill: new Fill({
          ...props.fill,
        }),
      });

      layer.value.addFilter(filter.value);
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

onBeforeUnmount(() => {
  if (filter.value) layer.value?.removeFilter(filter.value);
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
