<script setup lang="ts">
import { ref } from "vue";

const projection = ref("EPSG:4326");
const coordinateFormat = ref(6);
</script>

<template>
  <div class="container">
    <ol-map>
      <ol-tile tile-type="BAIDU"></ol-tile>
      <ol-mouse-position :projection="projection" :coordinate-format="coordinateFormat"></ol-mouse-position>
    </ol-map>
    <form>
      <label for="projection">Projection </label>
      <select id="projection" v-model="projection">
        <option value="EPSG:4326">EPSG:4326</option>
        <option value="EPSG:3857">EPSG:3857</option>
      </select>
      <label for="precision">Precision</label>
      <input id="precision" v-model="coordinateFormat" type="number" min="0" max="12" />
    </form>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
form {
  position: absolute;
  bottom: 10px;
  left: 10%;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
}
</style>
