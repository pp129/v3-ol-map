<script setup lang="ts">
import { FeatureGeometry, GeoCircle, GeoPolygon, VectorLayerOptions } from "@/packages";
import { ref } from "vue";

const modify = ref(false);
const layerStyle: VectorLayerOptions["layerStyle"] = {
  "text-value": ["get", "radius_size"],
  "text-fill-color": "white",
  "text-background-fill-color": "black",
  "text-offset-y": 0,
  "text-font": "bold 16px serif",
  "text-padding": [2, 8, 2, 8],
  "stroke-color": "red", //圆的边框颜色
  "stroke-width": 4, //圆的边框宽度
  "fill-color": "rgba(0,255,255,0.5)", //圆的填充颜色
};

const geometryData = ref<FeatureGeometry[]>([
  {
    type: "Circle",
    geometry: {
      center: [118.149554, 24.480543],
      radius: 500,
    },
    properties: {
      name: "Circle",
      radius_size: "500m",
    },
  },
  {
    type: "Polygon",
    geometry: {
      coordinates: [
        [
          [118.1246137577592, 24.520801352023774],
          [118.1368436543503, 24.53142561605206],
          [118.15046818827197, 24.520801352023774],
          [118.13940243408203, 24.512100997518466],
          [118.1246137577592, 24.520801352023774],
        ],
      ],
    },
    properties: {
      style: {
        fill: {
          color: "rgba(0,192,255,0.15)",
        },
        stroke: {
          color: "#00C0FF",
          width: 4,
          lineDash: [0],
        },
      },
    },
  },
]);
const onModifyEnd = (e: any) => {
  console.log("onModify", e);
  const feature = e.features.getArray()[0];
  console.log(feature.getGeometry().getType());
  const type = feature.getGeometry().getType();
  if (type === "Circle" && geometryData.value && geometryData.value[0]) {
    const geometry = geometryData.value[0].geometry as GeoCircle;
    // 直接改变图层要素
    geometry.center = feature.getGeometry().getCenter();
    const radius = feature.getGeometry().getRadius() * e.metersPerUnit;
    geometry.radius = radius;
    // 赋值label显示的值
    geometryData.value[0].properties.radius_size = radius.toFixed(2).toString() + "m";
  } else if (type === "Polygon" && geometryData.value && geometryData.value[1]) {
    const polygon = geometryData.value[1].geometry as GeoPolygon;
    // 直接改变图层要素
    const geometry = feature.getGeometry();
    polygon.coordinates = geometry.getCoordinates();
  }
};
</script>

<template>
  <div class="page">
    <form class="form">
      <label>是否可编辑</label>
      <input v-model="modify" type="checkbox" />
    </form>
    <ol-map :view="{ center: [118.1246137577592, 24.520801352023774], zoom: 14 }">
      <ol-vector :layer-style="layerStyle" :modify="modify" @modifyend="onModifyEnd">
        <ol-feature :geometries="geometryData" />
      </ol-vector>
    </ol-map>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  height: 100vh;
  position: relative;
}
.form {
  position: absolute;
  top: 3%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, 0);
}
</style>
