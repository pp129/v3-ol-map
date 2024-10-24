<script setup lang="ts">
import { onMounted, shallowRef } from "vue";
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import XYZ from "ol/source/XYZ.js";
import { defaults as defaultInteractions } from "ol/interaction.js";
import { defaults as defaultControls } from "ol/control.js";
import { GeoJSON, WFS } from "ol/format.js";
import { Fill, Stroke, Style, Text } from "ol/style.js";

let map = shallowRef<Map>();
let tileLayer = shallowRef<TileLayer<XYZ>>();
let tileSource = shallowRef<XYZ>();
const viewDefaultOption = {
  center: [108.5525, 34.3227], // China
  zoom: 5,
  constrainResolution: false,
  projection: "EPSG:4326",
};
const view = new View(viewDefaultOption);
let vectorLayer = shallowRef<VectorLayer<VectorSource>>();
let vectorSource = shallowRef<VectorSource>();
const init = async () => {
  tileSource.value = new XYZ({
    wrapX: false,
    url: "http://172.16.34.120:6080/arcgis/rest/services/xiamen/MapServer/tile/{z}/{y}/{x}",
    projection: "EPSG:4326",
  });
  tileLayer.value = new TileLayer({
    source: tileSource.value,
    zIndex: 0,
  });

  vectorSource.value = new VectorSource();
  vectorLayer.value = new VectorLayer({
    source: vectorSource.value,
    zIndex: 1,
    style: feature => {
      const text_ = feature.get("NAME"); // 设置文本内容
      return new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 0.5)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.1)",
        }),
        text: new Text({
          text: text_,
          font: "14px Calibri,sans-serif",
          fill: new Fill({
            color: "#000",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 3,
          }),
        }),
      });
    },
  });
  map.value = new Map({
    target: "map",
    view: view,
    controls: defaultControls({
      zoom: false,
      rotate: false,
      attribution: false,
    }),
    interactions: defaultInteractions({
      doubleClickZoom: false,
    }),
    layers: [tileLayer.value, vectorLayer.value],
  });
  // 鼠标悬浮
  map.value.on("pointermove", evt => {
    if (evt.dragging) {
      return;
    }
    const pixel = map.value?.getEventPixel(evt.originalEvent);
    if (pixel && map.value?.getViewport()) {
      const hit = map.value.hasFeatureAtPixel(pixel);
      map.value.getViewport().style.cursor = hit ? "pointer" : "";
    }
  });
};

onMounted(() => {
  init().then(() => {
    if (map.value && vectorSource.value) {
      const featureRequest = new WFS().writeGetFeature({
        featureNS: "http://218.5.80.6:6600/geoserver/xiaqu/ows",
        featureTypes: ["xiaqu:PaiChuSouXQ_polygon"],
        srsName: "EPSG:4326",
        outputFormat: "application/json",
        featurePrefix: "xiaqu",
      });

      // then post the request and add the received features to a layer
      fetch("http://218.5.80.6:6600/geoserver/xiaqu/ows", {
        method: "POST",
        body: new XMLSerializer().serializeToString(featureRequest),
      })
        .then(function (response) {
          return response.json();
        })
        .then(json => {
          const features = new GeoJSON().readFeatures(json);
          vectorSource.value?.addFeatures(features);
          // map.getView().fit(vectorSource.getExtent());
        });
    }
  });
});
</script>

<template>
  <div id="map" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
