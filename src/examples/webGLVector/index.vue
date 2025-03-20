<script setup lang="ts">
import { onMounted, shallowRef, ref, computed, onBeforeUnmount } from "vue";
import { OlMapInstance } from "@/packages";
import LinkFix from "@/examples/webGLVector/fix.ts";

const mapRef = shallowRef<OlMapInstance>();
const url =
  import.meta.env.VITE_JOINT_API_URL + "/Features/gd_route_clean/JointFeature?ak=" + import.meta.env.VITE_JOINT_AK;
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
  "stroke-width": 1.5,
  "text-value": ["get", "road_name"],
  "text-placement": "line",
};
const fixStyle = {
  "stroke-color": "#ff00ff",
  "stroke-width": 2,
};
const showSwitch = ref(false);
let switchValue = ref(false);
let zoom = ref<number | undefined>(15);
const enableFix = computed(() => {
  return zoom.value && zoom.value >= 15;
});
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

let data = shallowRef();
let fixData = shallowRef();
const timer = ref();

const init = () => {
  getData().then(res => {
    data.value = res;
    onChange();
  });
};

const reload = () => {
  init();
  timer.value = setTimeout(
    () => {
      reload();
    },
    1000 * 60 * 1,
  );
};

const onChange = () => {
  const view = mapRef.value?.map()?.getView();
  zoom.value = view?.getZoom();
  if (!enableFix.value) {
    switchValue.value = false;
  }
  fixData.value = undefined;
  if (switchValue.value) {
    const linkFixData = new LinkFix(data.value.features);
    fixData.value = {
      type: "FeatureCollection",
      features: linkFixData.TMCLINKPOBJ,
    };
  }
};

onMounted(() => {
  reload();
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <div class="container">
    <div v-show="showSwitch" class="switch">
      <input v-model="switchValue" type="checkbox" name="switch" :disabled="!enableFix" @change="onChange" />路口填补
      <p v-show="!enableFix">小层级下要素过多，进行填补计算会很卡</p>
    </div>
    <ol-map ref="mapRef" :view="{ zoom: 11, city: '厦门' }" @changeZoom="init">
      <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
      <ol-webgl-vector :layer-style="style" :z-index="1">
        <ol-feature :geo-json="data"></ol-feature>
      </ol-webgl-vector>
      <ol-vector :z-index="2" :layer-style="fixStyle"> <ol-feature :geo-json="fixData"></ol-feature> </ol-vector>
    </ol-map>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.switch {
  position: absolute;
  top: 30px;
  left: 120px;
  z-index: 1000;
  padding: 6px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 6px;
}
p {
  margin: 0;
  padding: 0;
}
</style>
