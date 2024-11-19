<script setup lang="ts">
import { ConfigProviderContext } from "@/packages";
import { onMounted, provide, ref } from "vue";

defineOptions({
  name: "OlConfig",
});
let rendered = ref(false);
const props = withDefaults(defineProps<ConfigProviderContext>(), {});
const init = async () => {
  console.log("init config", props);
  provide("ConfigProvide", props);
};

onMounted(async () => {
  init().then(() => {
    rendered.value = true;
  });
});
</script>

<template>
  <slot v-if="rendered" />
</template>

<style scoped></style>
