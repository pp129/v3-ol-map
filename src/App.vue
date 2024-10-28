<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const currentRoute = ref(router.currentRoute);
const isHome = computed(() => currentRoute.value.path === "/");
const backHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div v-if="!isHome" class="back-home" @click="backHome"></div>
  <router-view />
</template>

<style scoped>
.back-home {
  position: fixed;
  top: 2%;
  left: 2%;
  width: 40px;
  height: 40px;
  background: url(./assets/vue.svg) no-repeat center center;
  background-size: cover;
  cursor: pointer;
  z-index: 999;
}
</style>
