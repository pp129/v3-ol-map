<script setup lang="ts">
import { FeatureStyle, VectorSourceOptions, VMap } from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
};
type Source = {
  geoJSONSource: VectorSourceOptions;
  geoJsonStyle: FeatureStyle;
};
const jsonFeature: Source = {
  geoJSONSource: {
    url: "http://172.16.34.33:28080/geoserver/xiaqu/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=xiaqu:PaiChuSouXQ_polygon&&outputFormat=application/json",
    featureFormat: "GeoJSON",
  },
  geoJsonStyle: {
    fill: {
      color: "rgb(198, 226, 255,0.6)",
    },
    stroke: {
      color: "rgb(51, 126, 204)",
      width: 2,
    },
    text: {
      text: "",
      font: "16px sans-serif",
      fill: {
        color: "#fff",
      },
      stroke: {
        color: "#000",
        width: 3,
      },
    },
    styleFunction: function (feature: any, resolution: any, map: any, style: any) {
      const textStyle = style.getText(); // 获取文本样式
      const labelKey = "NAME";
      const text_ = feature.get(labelKey); // 设置文本内容
      textStyle.setText(text_); // 更新文本样式
      style.setText(textStyle);
      return style; // 返回样式
    },
  },
};
</script>

<template>
  <ol-map target="vectorGeoJson" :view="view">
    <ol-vector :source="jsonFeature.geoJSONSource" :feature-style="jsonFeature.geoJsonStyle"></ol-vector>
  </ol-map>
</template>
