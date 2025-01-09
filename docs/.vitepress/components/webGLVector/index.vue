<script setup lang="ts">
import { onMounted, shallowRef } from "vue";
import { OlMapInstance, OlMap, OlTile, OlWebglVector, OlFeature } from "v3-ol-map";

const mapRef = shallowRef<OlMapInstance>();
const url = "/admin-api/Features/gd_route_clean/JointFeature?ak=f5ce622f301640a7a1d9b7d7e1ac5f6b";
const colors = ["#4fd27d", "#ffd045", "#e80e0e", "#b40000", "#8f979c"];
const style = {
  "stroke-color": [
    "case",
    ["==", ["get", "state"], 1],
    colors[0],
    ["==", ["get", "state"], 2],
    colors[1],
    ["==", ["get", "state"], 3],
    colors[2],
    ["==", ["get", "state"], 4],
    colors[3],
    ["==", ["get", "state"], -1],
    colors[4],
    ["*", ["get", "state"], colors[0]],
  ],
  "stroke-width": 2,
};
const getData = async () => {
  const form = new FormData();
  form.append("f", "geojson");
  form.append("returnGeometry", "true");
  form.append("resultRecordCount", "50000");
  const view = mapRef.value?.map()?.getView();
  const zoom = view?.getZoom();
  const mapSize = mapRef.value?.map()?.getSize();
  if (!zoom) return;
  if (zoom < 15) {
    form.append("where", "roadclass in (1,2,3)");
  } else if (zoom >= 15 && zoom < 17) {
    form.append("where", "roadclass in (1,2,3,4)");
  } else if (zoom >= 17) {
    form.append("where", "roadclass in (1,2,3,4,5)");
  }
  const extent = view?.calculateExtent(mapSize);
  if (!extent) return;
  const polygon = [
    [extent[0], extent[1]],
    [extent[2], extent[1]],
    [extent[2], extent[3]],
    [extent[0], extent[3]],
    [extent[0], extent[1]],
  ];
  const geometry = {
    type: "Polygon",
    coordinates: [polygon],
  };
  form.append("geometry", JSON.stringify(geometry));
  return fetch(url, {
    method: "POST",
    body: form,
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      return data;
    });
};

const onChangeZoom = () => {
  init();
};

let data = shallowRef();

const init = () => {
  getData().then(res => {
    data.value = res;
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <ol-map ref="mapRef" :view="{ zoom: 11, city: '厦门' }" @changeZoom="onChangeZoom">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-webgl-vector :layer-style="style" :z-index="1">
      <ol-feature :geo-json="data"></ol-feature>
    </ol-webgl-vector>
  </ol-map>
</template>

<style scoped></style>
