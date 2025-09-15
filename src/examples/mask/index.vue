<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { VMap, GeoJSON } from "@/packages";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  projection: "EPSG:4326",
};
const geojsonData = ref<GeoJSON>();

// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};

const getVectorData = () => {
  geojsonData.value = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()]],
    },
    properties: {
      name: "Polygon",
    },
  };
};

const maskFill = ref({
  color: "rgba(0, 0, 0, 0.6)",
});

// 更新遮罩数据，验证监听功能
const updateMaskData = () => {
  getVectorData();
  console.log("遮罩数据已更新", geojsonData.value);
};
onMounted(() => {
  getVectorData();
});
</script>

<template>
  <div class="demo-container">
    <div class="control-panel">
      <button class="update-btn" @click="updateMaskData">更新遮罩数据</button>
      <p class="tip">点击按钮验证遮罩组件对feature参数的监听功能</p>
    </div>
    <ol-map class="map-container" :view="view">
      <ol-tile tile-type="BAIDU">
        <ol-mask :feature="geojsonData" :shadow-width="50" :fill="maskFill"></ol-mask>
      </ol-tile>
    </ol-map>
  </div>
</template>

<style scoped>
.demo-container {
  position: relative;
  width: 100%;
  height: 100vh;
}
.control-panel {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.update-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.update-btn:hover {
  background: #337ecc;
}

.tip {
  margin: 10px 0 0 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.map-container {
  width: 100%;
  height: 100vh;
}
</style>
