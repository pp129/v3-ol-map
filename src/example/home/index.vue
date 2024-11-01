<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const routes = router.getRoutes();

const routesToDisplay = routes.filter(route => route.name && route.name !== "home" && !route.meta.hidden);
</script>

<template>
  <div class="home">
    <div v-for="item in routesToDisplay" :key="item.name" class="demo">
      <p class="title">{{ item.meta.title }}</p>
      <br />
      <span class="description"> {{ item.meta.description }} </span>
      <br />
      <span class="route"
        >&Map;<router-link :to="item.path"> {{ item.path }} </router-link></span
      >
    </div>
  </div>
</template>

<style scoped>
.home {
  overflow: auto;
  height: calc(100% - 40px);
  background-color: #f0f0f0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  padding: 20px;
}
.demo {
  height: 180px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.description {
  font-size: 16px;
  color: #666;
}
.route {
  font-size: 16px;
  color: #666;
}
</style>
