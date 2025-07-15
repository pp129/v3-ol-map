<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouteRecordNormalized, useRouter } from "vue-router";

const router = useRouter();
const routes = router.getRoutes();

const routesToDisplay = ref<RouteRecordNormalized[]>([]);

const getRoutesToDisplay = (): RouteRecordNormalized[] => {
  return routes.filter(route => route.name && route.name !== "home" && !route.meta.hidden);
};

const keyword = ref("");
const handleInput = () => {
  const keywordValue = keyword.value.toLowerCase();
  routesToDisplay.value = getRoutesToDisplay().filter(
    route =>
      route.path.toLowerCase().includes(keywordValue) ||
      route.meta?.title?.toLowerCase().includes(keywordValue) ||
      route.meta?.description?.toLowerCase().includes(keywordValue),
  );
};

onMounted(() => {
  routesToDisplay.value = getRoutesToDisplay();
});
</script>

<template>
  <div class="home">
    <div class="search">
      <input v-model="keyword" type="text" placeholder="Title or Description or Path" @input="handleInput" />
    </div>
    <div class="grid">
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
  </div>
</template>

<style scoped>
.home {
  background-color: #f0f0f0;
  height: 100%;
}
.search {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}
input {
  width: 80%;
  height: 36px;
  padding-left: 12px;
  border: none;
  border-radius: 6px;
}
.grid {
  height: calc(100% - 40px - 48px - 20px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  padding: 20px;
  overflow: auto;
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
