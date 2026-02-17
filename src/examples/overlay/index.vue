<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  OlMap,
  OlTile,
  OlVector,
  OlFeature,
  OlOverlay,
  VMap,
  GeoJSON,
  Position,
  SimpleGeometry,
  utils,
} from "v3-ol-map";
import icon from "@/assets/vue.svg";

const view: VMap["view"] = {
  zoom: 13,
  center: [118.11022, 24.490474],
};

// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};

// 创建多个标记点
const geojson = ref<GeoJSON>({
  type: "FeatureCollection",
  features: [
    {
      id: "1",
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [118.08022, 24.480474],
      },
      properties: {
        name: "标记点 1",
        description: "这是第一个标记点",
      },
    },
    {
      id: "2",
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [118.13022, 24.500474],
      },
      properties: {
        name: "标记点 2",
        description: "这是第二个标记点",
      },
    },
    {
      id: "3",
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [118.09522, 24.510474],
            [118.10522, 24.510474],
            [118.10522, 24.520474],
            [118.09522, 24.520474],
            [118.09522, 24.510474],
          ],
        ],
      },
      properties: {
        name: "多边形区域",
        description: "这是一个多边形区域",
        style: {
          fill: {
            color: "rgba(255, 0, 0, 0.1)",
          },
          stroke: {
            color: "red",
            width: 2,
          },
          text: {
            text: "多边形区域",
            fill: {
              color: "white",
            },
            stroke: {
              color: "black",
              width: 2,
            },
          },
        },
      },
    },
  ],
});

// Overlay 相关状态
const overlayPosition = ref<Position>();
const overlayInfo = reactive({
  name: "",
  description: "",
});

// 点击标记点显示 Overlay
const onClickMarker = (...args: any[]) => {
  const [evt, feature] = args;
  if (feature) {
    const geom = feature.getGeometry() as SimpleGeometry;
    if (geom) {
      const type = geom.getType();
      overlayInfo.name = feature.get("name");
      overlayInfo.description = feature.get("description");

      if (type === "Point") {
        overlayPosition.value = geom.getCoordinates() || evt.coordinate;
      } else {
        const { topCenter } = utils.calculateCenter(geom);
        overlayPosition.value = topCenter;
      }
    }
  }
};

// 关闭 Overlay
const closeOverlay = () => {
  overlayPosition.value = undefined;
};
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>

    <!-- 矢量图层 -->
    <ol-vector
      :z-index="1"
      :layer-style="{
        'icon-src': icon,
        'icon-scale': 1.2,
        'text-value': ['get', 'name'],
        'text-fill-color': 'white',
        'text-background-fill-color': '#409eff',
        'text-offset-y': 28,
        'text-padding': [4, 10, 4, 10],
      }"
      @singleclick="onClickMarker"
    >
      <ol-feature :geo-json="geojson" />
    </ol-vector>

    <!-- Overlay 弹窗 -->
    <ol-overlay :position="overlayPosition" :class="['overlay-popup']" positioning="bottom-center" :offset="[0, -30]">
      <div class="overlay-container">
        <i class="close-btn" @click="closeOverlay">&times;</i>
        <div class="overlay-header">
          <h3>{{ overlayInfo.name }}</h3>
        </div>
        <div class="overlay-content">
          <p>{{ overlayInfo.description }}</p>
        </div>
      </div>
    </ol-overlay>
  </ol-map>

  <div class="tips">点击地图上的标记点查看 Overlay 弹窗</div>
</template>

<style scoped>
.overlay-popup {
  min-width: 200px;
}

.overlay-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.overlay-container::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.close-btn {
  position: absolute;
  right: 8px;
  top: 8px;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  font-style: normal;
  z-index: 2;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.overlay-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 15px;
  color: white;
}

.overlay-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.overlay-content {
  padding: 15px;
  color: #333;
}

.overlay-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.tips {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  font-size: 14px;
  color: #333;
  backdrop-filter: blur(10px);
}
</style>
