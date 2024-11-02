<script setup lang="ts">
import EChartsLayer from "ol-echarts";
import { inject, onBeforeUnmount, onMounted, ref, shallowRef, unref, watch } from "vue";
import OlMap from "@/packages/lib";
import { EchartsOptions } from "@/packages";

defineOptions({
  name: "OlEcharts",
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<EChartsLayer>();
let rendered = ref(false);

const props = withDefaults(defineProps<EchartsOptions>(), {
  visible: true,
});
const emit = defineEmits(["load"]);
const init = () => {
  layer.value = new EChartsLayer(props.chartOptions, props.options);
  layer.value.on("load", () => {
    rendered.value = true;
    emit("load");
  });
  if (props.zIndex) layer.value.setZIndex(props.zIndex);
  layer.value.setVisible(props.visible);
  layer.value?.appendTo(map);
};

watch(
  () => props.visible,
  val => {
    layer.value?.setVisible(val);
  },
);
watch(
  () => props.zIndex,
  val => {
    if (val || val === 0 || val === null) layer.value?.setZIndex(val);
  },
);
watch(
  () => props.chartOptions,
  val => {
    if (val) layer.value?.setChartOptions(val);
  },
  { deep: true },
);

onMounted(() => {
  init();
});
onBeforeUnmount(() => {
  layer.value?.remove();
});
</script>

<template>
  <slot v-if="rendered"></slot>
</template>

<style scoped></style>
