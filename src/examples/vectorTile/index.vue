<script setup lang="ts">
import { shallowRef } from "vue";
import { OlMapInstance, type SourceOptions, VectorTileOptions } from "@/packages";
import { ReadFeaturesOptions } from "@/packages/utils";

const mapRef = shallowRef<OlMapInstance>();
const xyz: SourceOptions = {
  url: "http://172.16.34.120:6080/arcgis/rest/services/xiamen/MapServer/tile/{z}/{y}/{x}",
  projection: "EPSG:4326",
};
const url =
  import.meta.env.VITE_JOINT_API_URL + "/Features/gd_route_clean/JointFeature?ak=" + import.meta.env.VITE_JOINT_AK;
const colors = ["#4fd27d", "#ffd045", "#e80e0e", "#b40000", "#8f979c"];
const style: any = {
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
let sourceOptions = shallowRef<VectorTileOptions["source"]>();
let layerRef = shallowRef();
const getData = async () => {
  const form = new FormData();
  form.append("f", "geojson");
  form.append("returnGeometry", "true");
  form.append("resultRecordCount", "50000");
  const view = mapRef.value?.map()?.getView();
  const zoom = view?.getZoom();
  const mapSize = mapRef.value?.map()?.getSize();
  if (!zoom) return;
  if (zoom < 14) {
    form.append("where", "roadclass in (1,2,3)");
  } else if (zoom >= 14 && zoom < 16) {
    form.append("where", "roadclass in (1,2,3,4)");
  } else if (zoom >= 16) {
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

const init = () => {
  const map = mapRef.value?.getMap();
  const vectorTileSource = layerRef.value.getSource();
  getData().then(data => {
    sourceOptions.value = {
      projection: "EPSG:4326",
      tileUrlFunction: function (tileCoord) {
        return JSON.stringify(tileCoord);
      },
      tileLoadFunction: function (tile: any) {
        const tileCoord = tile.getTileCoord();
        const features = mapRef.value?.readFeatures(<ReadFeaturesOptions>{
          source: data,
          options: {
            extent: vectorTileSource?.getTileGrid()?.getTileCoordExtent(tileCoord),
            featureProjection: map?.getView().getProjection(),
          },
        });
        if (features) tile.setFeatures(features);
      },
    };
  });
};
</script>

<template>
  <ol-map ref="mapRef" :view="{ zoom: 13, city: '厦门' }" @changeZoom="init">
    <ol-tile tile-type="XYZ" :source="xyz" :z-index="0"></ol-tile>
    <ol-vector-tile
      ref="layerRef"
      :z-index="1"
      :declutter="true"
      :layer-style="style"
      :source="sourceOptions"
      @sourceready="init"
    ></ol-vector-tile>
  </ol-map>
</template>

<style scoped></style>
