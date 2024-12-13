<script setup lang="ts">
import { OlMap, OlVector, OlWfs, VMap, WFSOptions, FeatureStyle } from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 11,
  center: [118.12582777425764, 24.637526109241485],
};
type JSONFeature = {
  options: WFSOptions["options"];
  geoJsonStyle: FeatureStyle;
};
const jsonFeature: JSONFeature = {
  options: {
    featureNS: "http://172.16.34.33:28080/geoserver/xiaqu/ows",
    featureTypes: ["xiaqu:PaiChuSouXQ_polygon"],
    srsName: "EPSG:4326",
    featurePrefix: "xiaqu",
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
    styleFunction: function (feature, resolution, map, style) {
      const textStyle = style.getText(); // 获取文本样式
      if (textStyle) {
        const labelKey = "NAME";
        const text_ = feature.get(labelKey); // 设置文本内容
        textStyle.setText(text_); // 更新文本样式
        style.setText(textStyle);
      }
      return style; // 返回样式
    },
  },
};
const handleClick = (evt: any, feature?: any) => {
  if (feature) {
    const geo = feature.getGeometry();
  }
};
</script>

<template>
  <ol-map :view="view">
    <ol-vector :feature-style="jsonFeature.geoJsonStyle" @singleclick="handleClick">
      <ol-wfs :options="jsonFeature.options"></ol-wfs>
    </ol-vector>
  </ol-map>
</template>
