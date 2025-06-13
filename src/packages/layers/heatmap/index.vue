<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import useBaseLayer from "@/packages/layers/baseLayer";
import { nanoid } from "nanoid";
import VectorSource from "ol/source/Vector.js";
import OlMap from "@/packages/lib";
import { Heatmap, type Layer } from "ol/layer.js";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import type { Pixel } from "ol/pixel";
import { unByKey } from "ol/Observable.js";
import type { HeatmapOptions } from "@/packages/types/Heatmap";

defineOptions({
  name: "OlHeatmap",
});

const props = withDefaults(defineProps<HeatmapOptions>(), {
  layerId: "",
  visible: true,
  gradient: () => {
    return ["#00f", "#0ff", "#0f0", "#ff0", "#f00"];
  },
  blur: 15,
  radius: 8,
  weight: "weight",
});
// 属性继承 ol/layer/Base
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<Heatmap>();
let vector_source = shallowRef<VectorSource>();
let eventRender = ref<any[]>([]);
const eventList: any[] = ["singleclick", "pointermove"];
const emit: any = defineEmits([
  "singleclick",
  "pointermove",
  "sourceready",
  "featuresloadend",
  "featuresloadstart",
  "addfeature",
]);
let layerReady = ref(false);

provide("ParentLayer", layer);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});
watch(
  () => props.blur,
  nVal => {
    if (layer.value || nVal === 0) {
      layer.value?.setBlur(nVal);
    }
  },
);
watch(
  () => props.radius,
  nVal => {
    if (layer.value || nVal === 0) {
      layer.value?.setRadius(nVal);
    }
  },
);
watch(
  () => props.gradient,
  nVal => {
    if (layer.value) {
      layer.value?.setGradient(nVal);
    }
  },
  {
    deep: true,
  },
);
watch(
  () => props.source,
  () => {
    vector_source.value?.clear();
    if (layer.value) map.removeLayer(layer.value);
    init();
  },
);
const init = () => {
  vector_source.value = new VectorSource({ ...props.source });
  vector_source.value.once("addfeature", () => {
    emit("addfeature", layer.value, vector_source.value);
  });
  layer.value = new Heatmap({
    ...props,
    source: vector_source.value,
  });
  const layerId = props.layerId || `heatmap-layer-${nanoid()}`;
  layer.value.set("id", layerId);
  map.addLayer(layer.value);
  // 绑定事件
  eventList.forEach(listenerKey => {
    eventRender.value.push(
      map.on(listenerKey, (evt: MapObjectEventTypes) => {
        eventHandler(listenerKey, evt);
      }),
    );
  });
  layer.value.on("sourceready", () => {
    layerReady.value = true;
    emit("sourceready", layer.value);
  });
};

const eventHandler = (listenerKey: string, evt: MapObjectEventTypes) => {
  const { pixel } = evt;
  const feature = getFeatureAtPixel(pixel);
  emit(listenerKey, evt, feature);
};

const getFeatureAtPixel = (pixel: Pixel) => {
  return map.forEachFeatureAtPixel(
    pixel,
    feature => {
      return feature;
    },
    {
      layerFilter: (vector_layer: Layer) => {
        return vector_layer.get("id") === layer.value?.get("id");
      },
    },
  );
};

const dispose = () => {
  // 移除事件
  eventRender.value.forEach(listenerKey => {
    unByKey(listenerKey);
  });
};

onMounted(() => {
  init();
});
onBeforeUnmount(() => {
  dispose();
});
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped lang="scss"></style>
