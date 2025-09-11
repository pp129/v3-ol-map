<script lang="ts" setup>
import { ref } from "vue";
import { VMap } from "@/packages";

const view: VMap["view"] = {
  zoom: 13,
  center: [118.125827, 24.637526],
  projection: "EPSG:4326",
};

const trafficVisible = ref(true);
const trafficOpacity = ref(0.8);
const updateInterval = ref(30000);
const showLegend = ref(true);
const customColors = ref(["#34b000", "#fecb00", "#df0100", "#8e0e0b", "#8f979c"]);
const lineWidth = ref(1.5);
const trafficUrl = ref(
  "http://36.248.238.35:8888/admin-api/Features/gd_route_clean/JointFeatureXmGaode?ak=f5ce622f301640a7a1d9b7d7e1ac5f6b",
);

// 新增的图层基础属性
const zIndex = ref(100);
const minZoom = ref(0);
const maxZoom = ref(20);

// 请求参数配置
const requestParams = ref({
  f: "geojson",
  returnGeometry: true,
  resultRecordCount: 50000,
});

// 附加过滤条件（会与层级过滤组合）
const customWhere = ref("");

// 自定义geometry参数（为空时使用当前视窗范围）
const customGeometry = ref("");

// 当前地图缩放级别
const currentZoom = ref(13);

// 当前使用的where参数
const currentWhere = ref("roadclass in (1,2,3,4,5)");

// 当前使用的geometry参数
const currentGeometry = ref("");

const toggleTraffic = () => {
  trafficVisible.value = !trafficVisible.value;
};

const changeOpacity = (opacity: number) => {
  trafficOpacity.value = opacity;
};

const changeUpdateInterval = (interval: number) => {
  updateInterval.value = interval;
};

// 交通组件引用
const trafficRef = ref();

// 更新当前缩放级别和where参数显示
const updateCurrentInfo = () => {
  if (trafficRef.value) {
    currentZoom.value = trafficRef.value.getCurrentZoom();
    currentWhere.value = trafficRef.value.getCurrentWhere();
    currentGeometry.value = trafficRef.value.getCurrentGeometry();
  }
};

// 定时更新当前信息
setInterval(updateCurrentInfo, 1000);

// 处理交通要素点击事件
const handleTrafficClick = (featureInfo: any) => {
  alert(
    `道路名: ${featureInfo.road_name}\n速度: ${featureInfo.speed} km/h\n状态: ${featureInfo.stateText}\nGID: ${featureInfo.gid}\n要素ID: ${featureInfo.feature_id}`,
  );
};
</script>

<template>
  <div class="traffic-example">
    <ol-map class="map-container" :view="view">
      <ol-tile tile-type="BAIDU"></ol-tile>
      <ol-traffic
        ref="trafficRef"
        :visible="trafficVisible"
        :opacity="trafficOpacity"
        :update-interval="updateInterval"
        :show-legend="showLegend"
        :colors="customColors"
        :line-width="lineWidth"
        :url="trafficUrl"
        :z-index="zIndex"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :request-params="requestParams"
        :where="customWhere || undefined"
        :geometry="customGeometry || undefined"
        @click="handleTrafficClick"
      />
    </ol-map>

    <div class="control-panel">
      <h3>交通层控制</h3>

      <div class="control-item">
        <label>
          <input v-model="trafficVisible" type="checkbox" />
          显示交通层
        </label>
      </div>

      <div class="control-item">
        <label>
          <input v-model="showLegend" type="checkbox" />
          显示图例
        </label>
      </div>

      <div class="control-item">
        <label>透明度: {{ trafficOpacity }}</label>
        <input v-model.number="trafficOpacity" type="range" min="0" max="1" step="0.1" />
      </div>

      <div class="control-item">
        <label>线条宽度: {{ lineWidth }}</label>
        <input v-model.number="lineWidth" type="range" min="0.5" max="10" step="0.5" />
      </div>

      <div class="control-item">
        <label>服务地址:</label>
        <input v-model="trafficUrl" type="text" class="url-input" placeholder="请输入交通数据服务地址" />
      </div>

      <div class="control-item">
        <label>图层层级: {{ zIndex }}</label>
        <input v-model.number="zIndex" type="range" min="0" max="1000" step="10" />
      </div>

      <div class="control-item">
        <label>最小缩放级别: {{ minZoom }}</label>
        <input v-model.number="minZoom" type="range" min="0" max="18" step="1" />
      </div>

      <div class="control-item">
        <label>最大缩放级别: {{ maxZoom }}</label>
        <input v-model.number="maxZoom" type="range" min="2" max="22" step="1" />
      </div>

      <div class="control-item info-display">
        <h4>实时信息</h4>
        <div class="info-item">
          <span class="info-label">当前缩放级别:</span>
          <span class="info-value">{{ currentZoom }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">基础where条件:</span>
          <span class="info-value">{{ currentWhere.split(" AND ")[0] || currentWhere }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">完整where参数:</span>
          <span class="info-value">{{ currentWhere }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前geometry:</span>
          <span class="info-value geometry-display">{{
            currentGeometry
              ? currentGeometry.length > 50
                ? currentGeometry.substring(0, 50) + "..."
                : currentGeometry
              : "无"
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-label"> 🔄 优化说明:</span>
          <span class="info-value optimization-text">已启用节流防抖</span>
        </div>
        <small class="optimization-hint">
          • 统一防抖: 2秒内只触发一次请求<br />
          • 适用于: 缩放/移动/参数修改等所有操作<br />
          • 提升性能: 减少频繁网络请求
        </small>
      </div>

      <div class="control-item">
        <label>附加过滤条件:</label>
        <input
          v-model="customWhere"
          type="text"
          class="url-input"
          placeholder="例：road_type = 'highway' 或 speed > 60"
        />
        <small class="param-hint"> 输入附加的过滤条件，会与层级过滤组合使用 (AND 连接) </small>
      </div>

      <div class="control-item">
        <label>自定义几何范围:</label>
        <textarea
          v-model="customGeometry"
          class="geometry-input"
          placeholder='输入GeoJSON Polygon格式，例如: {"type":"Polygon","coordinates":[[[118.1,24.6],[118.2,24.6],[118.2,24.7],[118.1,24.7],[118.1,24.6]]]}'
          rows="3"
        ></textarea>
        <small class="param-hint"> 留空时自动使用当前地图视窗范围作为查询范围 </small>
      </div>

      <div class="control-item">
        <label>请求参数配置:</label>
        <div class="param-inputs">
          <div class="param-input">
            <label class="param-label">f:</label>
            <input v-model="requestParams.f" type="text" class="param-value" />
          </div>
          <div class="param-input">
            <label class="param-label">returnGeometry:</label>
            <select v-model="requestParams.returnGeometry" class="param-value">
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </div>
          <div class="param-input">
            <label class="param-label">resultRecordCount:</label>
            <input v-model.number="requestParams.resultRecordCount" type="number" class="param-value" />
          </div>
        </div>
      </div>

      <div class="control-item">
        <label>更新间隔:</label>
        <select v-model="updateInterval">
          <option :value="10000">10秒</option>
          <option :value="30000">30秒</option>
          <option :value="60000">1分钟</option>
          <option :value="300000">5分钟</option>
        </select>
      </div>

      <div class="control-item">
        <button @click="toggleTraffic">{{ trafficVisible ? "隐藏" : "显示" }}交通层</button>
      </div>

      <div class="control-item">
        <label>颜色配置:</label>
        <div class="color-inputs">
          <div v-for="(color, index) in customColors" :key="index" class="color-input">
            <label class="color-label"> {{ ["state=1", "state=2", "state=3", "state=4", "state=-1"][index] }}: </label>
            <input v-model="customColors[index]" type="color" class="color-picker" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.traffic-example {
  width: 100%;
  height: 100vh;
  position: relative;
}

.map-container {
  width: 100%;
  height: 100%;
}

.control-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  padding: 20px;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  min-width: 280px;
  max-width: 320px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-panel:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* 添加滚动条样式 */
.control-panel::-webkit-scrollbar {
  width: 6px;
}

.control-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.control-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.2s ease;
}

.control-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.control-panel h3 {
  margin: 0 0 20px 0;
  color: #1a202c;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
}

.control-panel h3::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 1px;
}

.control-item {
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.2s ease;
}

.control-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.control-item:hover {
  background: rgba(59, 130, 246, 0.02);
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0 -12px 16px -12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
}

.control-item label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.control-item input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  transition: all 0.2s ease;
}

.control-item input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.control-item input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.4);
}

.control-item select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 13px;
  color: #374151;
  transition: all 0.2s ease;
  cursor: pointer;
}

.control-item select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.control-item button {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.control-item button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.control-item button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.control-item button:hover::before {
  left: 100%;
}

.control-item button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.control-item input[type="checkbox"] {
  margin-right: 6px;
}

.color-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-label {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.color-picker {
  width: 40px;
  height: 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.url-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  margin-top: 8px;
  background: white;
  color: #374151;
  transition: all 0.2s ease;
}

.url-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.geometry-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 11px;
  margin-top: 8px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  resize: vertical;
  min-height: 70px;
  background: #f8fafc;
  color: #374151;
  line-height: 1.5;
  transition: all 0.2s ease;
}

.geometry-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

.param-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}

.param-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.param-label {
  font-size: 11px;
  color: #666;
  margin: 0;
  min-width: 120px;
}

.param-value {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 11px;
  margin-left: 8px;
}

.info-display {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;
}

.info-display::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
}

.info-display h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #1e40af;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-display h4::before {
  content: "📊";
  font-size: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(59, 130, 246, 0.1);
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
}

.info-value {
  color: #1e40af;
  font-weight: 600;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  text-align: right;
  word-break: break-all;
}

.param-hint {
  display: block;
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  line-height: 1.3;
}

.optimization-text {
  color: #28a745;
  font-weight: bold;
}

.optimization-hint {
  display: block;
  font-size: 9px;
  color: #28a745;
  margin-top: 4px;
  line-height: 1.4;
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 6px;
  border-radius: 3px;
  border-left: 2px solid #28a745;
}
</style>
