<script setup lang="ts">
import { FeatureGeometry, GeoCircle, VectorLayerOptions } from "v3-ol-map";
import { ref } from "vue";

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
      center: [108.5525, 34.3227],
      radius: 500,
    },
    properties: {
      name: "Circle",
      radius_size: "500m",
    },
  },
]);
const onModifyEnd = (e: any) => {
  console.log("onModify", e);
  const feature = e.features.getArray()[0];
  if (feature.getGeometry().getType() === "Circle" && geometryData.value && geometryData.value[0]) {
    const geometry = geometryData.value[0].geometry as GeoCircle;
    // 直接改变图层要素
    geometry.center = feature.getGeometry().getCenter();
    const radius = feature.getGeometry().getRadius() * e.metersPerUnit;
    geometry.radius = radius;
    // 赋值label显示的值
    geometryData.value[0].properties.radius_size = radius.toFixed(2).toString() + "m";
  }
};
</script>

<template>
  <ol-map target="modifyFeature" :view="{ zoom: 14 }">
    <ol-vector :layer-style="layerStyle" :modify="true" @modifyend="onModifyEnd">
      <ol-feature :geometries="geometryData" />
    </ol-vector>
  </ol-map>
</template>
