<script setup lang="ts">
import {
  OlMap,
  OlTile,
  OlVector,
  OlFeature,
  FeatureGeometry,
  FeatureStyle,
  VMap
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 13,
  center: [118.11022, 24.490474],
  smoothExtentConstraint: true,
  constrainResolution: true,
};
const geometryData: FeatureGeometry[] = [
  {
    type: "Point",
    geometry: {
      coordinates: [118.11022, 24.490474],
    },
    properties: {
      name: "Point",
      style: <FeatureStyle>{
        icon: {
          src: "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/vue.svg",
          width: 24,
          height: 24,
        },
        text: {
          text: "在元素上定义样式，>12级才显示文字",
          font: "13px sans-serif",
          fill: {
            color: "#3d73e8",
          },
          backgroundFill: {
            color: "#ffffff",
          },
          stroke: {
            color: "#ffffff",
            width: 1,
          },
          backgroundStroke: {
            color: "#000000",
            width: 1,
          },
          offsetX: 0,
          offsetY: 30,
        },
        styleFunction: function (feature, resolution, map, style) {
          const viewZoom = map.getView().getZoom();
          const textStyle = style.getText();
          const properties = feature.get("style");
          let originText = "";
          if (properties) {
            originText = properties.text.text;
          }
          const image = style.getImage();
          if (image && viewZoom && textStyle) {
            image.setScale(viewZoom / 12);
            if (viewZoom <= 12) {
              textStyle.setText("");
            }
            if (viewZoom >= 13) {
              textStyle.setText(originText);
              image.setScale(2);
            }
            if (viewZoom >= 14) {
              textStyle.setText(`根据层级显示不同内容,当前层级：${viewZoom}级`);
              image.setScale(1);
            }
            style.setText(textStyle);
            style.setImage(image);
          }
          return style;
        },
      },
    },
  },
];
</script>

<template>
  <ol-map target="featureStyle" :view="view">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-vector :z-index="1">
      <ol-feature :geometries="geometryData"></ol-feature>
    </ol-vector>
  </ol-map>
</template>
