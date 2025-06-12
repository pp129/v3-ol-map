<script lang="ts" setup>
import { inject, onMounted, provide, Ref, ref, shallowRef, unref } from "vue";
import OlMap from "@/packages/lib";
import Group, { Options } from "ol/layer/group";

defineOptions({
  name: "OlGroupLayer",
});

type GroupOptions = Partial<Options>;
const props = withDefaults(defineProps<GroupOptions>(), {});
const VMap = inject<Ref<OlMap> | undefined>("VMap", undefined);

const layer = shallowRef<Group>();
let layerReady = ref(false);

const init = () => {
  layer.value = new Group(props);
  if (VMap) {
    const map = unref(VMap).map;
    map?.setLayerGroup(layer.value);
    layerReady.value = true;
  }
};

onMounted(() => {
  init();
});

provide("GroupLayer", layer);
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped></style>
