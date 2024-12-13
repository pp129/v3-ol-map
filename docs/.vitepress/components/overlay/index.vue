<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  OlMap,
  OlTile,
  OlVector,
  OlFeature,
  OlOverlay,
  GeoJSON,
  GeoJSONFeature,
  VectorLayerOptions,
  VMap,
  Position,
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.11022, 24.490474],
};
const layerStyle: VectorLayerOptions["layerStyle"] = {
  "text-value": ["get", "name"],
  "text-fill-color": "white",
  "text-background-fill-color": "red",
  "text-offset-y": 28,
  "text-padding": [2, 8, 2, 8],
  "icon-src": "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/vue.svg",
  "stroke-color": "black", //圆的边框颜色
  "stroke-width": 8, //圆的边框宽度
  "fill-color": "rgba(255,255,0,0.5)", //圆的填充颜色
};
let geojson = ref<GeoJSON>();
// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};
const getVectorData = () => {
  const mockData = [
    {
      id: "1",
      name: "Point1",
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
    {
      id: "2",
      name: "Point2",
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
  ];
  const features: GeoJSONFeature[] = mockData.map(item => {
    return {
      id: item.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.longitude, item.latitude],
      },
      properties: item,
    };
  });
  geojson.value = {
    type: "FeatureCollection",
    features,
  };
};
let info = reactive({
  name: "",
});
let position = ref<Position>();
const onClickLayer = (evt: any, feature?: any) => {
  if (feature) {
    info.name = feature.get("name");
    position.value = evt.coordinate;
  }
};
onMounted(() => {
  getVectorData();
});
</script>

<template>
  <ol-map class="map-vector" target="vector" :view="view">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-vector
      ref="vector"
      :layer-style="layerStyle"
      :z-index="1"
      @singleclick="onClickLayer"
    >
      <ol-feature :geo-json="geojson" />
    </ol-vector>
    <ol-overlay :position="position" :class="['overlay']" positioning="bottom-center" :offset="[0, -20]">
      <i class="close" @click="position = undefined">&times;</i>
      <div class="content">
        {{ info.name }}
      </div>
    </ol-overlay>
  </ol-map>
</template>

<style scoped>
.map-vector {
  position: relative;
}
.overlay {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}
.overlay .content {
  z-index: 1;
}
.overlay .close {
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
  z-index: 2;
}
</style>
