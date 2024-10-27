<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import icon from "@/assets/vue.svg";
import cluster4 from "@/assets/images/cluster4.png";
import { ClusterLayerOptions, OlFeatureInstance, VMap, GeoJSONFeature, FeatureCollection } from "@/packages";

const view: VMap["view"] = {
  zoom: 8,
  center: [118.12582777425764, 24.637526109241485],
};

const layerStyle: ClusterLayerOptions["layerStyle"] = {
  icon: {
    src: icon,
    scale: 0.6,
  },
};
const clusterStyle: ClusterLayerOptions["clusterStyle"] = {
  icon: {
    src: cluster4, //该聚合样式图标
  },
};
const clusterJson = ref<FeatureCollection>();
type clusterPointInfo = {
  id: number;
  name?: string;
};
interface OverlayClusterOptions {
  cluster?: boolean;
  list: clusterPointInfo[];
  info?: clusterPointInfo;
  position?: number[];
}
const clusterOverlay = <OverlayClusterOptions>reactive({
  cluster: false,
  list: [],
  info: {
    id: 0,
    name: "",
  },
  position: undefined,
});

let clusterRef = ref<OlFeatureInstance>();
const onClickClusterLayer = (evt: any, feature: any) => {
  console.log("onClickClusterLayer", evt, feature);
  if (feature) {
    clusterOverlay.cluster = feature.get("cluster");
    if (clusterOverlay.cluster) {
      clusterOverlay.list = [];
      const id = feature.get("cluster_id");
      const count = feature.get("point_count");
      if (count <= 10) {
        const children = clusterRef.value?.getLeaves(id, Infinity);
        if (children) {
          clusterOverlay.list = children.map((child: any) => {
            return child.properties;
          });
        }
      }
      clusterOverlay.position = feature.get("coordinates") || evt.coordinate;
    } else {
      console.log(feature.get("properties"));
      clusterOverlay.info = feature.get("properties");
      clusterOverlay.position = feature.get("coordinates") || evt.coordinate;
    }
  }
};
const showClusterItem = (id: number) => {
  const feature = clusterJson.value?.features.find((x: any) => x.properties.id === id);
  if (feature) {
    clusterOverlay.info = feature.properties as clusterPointInfo;
    clusterOverlay.cluster = false;
  }
};

let loaded = ref(false);

// 随机聚合点
const getClusterData = () => {
  let features: GeoJSONFeature[] = [];
  fetch(
    "http://172.16.34.132:8222/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test:camera_30w&outputFormat=application/json&maxFeatures=20000",
  )
    .then(res => res.json())
    .then((data: any) => {
      console.log(data);
      features = data.features;
      clusterJson.value = { type: "FeatureCollection", features };
      loaded.value = true;
    });
};

onMounted(() => {
  getClusterData();
});
</script>

<template>
  <ol-map :view="view" @dblclick="clusterOverlay.position = undefined">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-cluster
      v-if="loaded"
      :z-index="2"
      class-name="layer-cluster"
      :layer-style="layerStyle"
      :cluster-style="clusterStyle"
      :super-cluster="{ radius: 120 }"
      @singleclick="onClickClusterLayer"
    >
      <ol-feature ref="clusterRef" :geo-json="clusterJson" />
    </ol-cluster>
    <ol-overlay
      v-if="clusterOverlay.cluster"
      :class="['overlay', 'overlay-cluster']"
      :position="clusterOverlay.position"
    >
      <ul v-if="clusterOverlay.list.length > 0">
        <li v-for="item in clusterOverlay.list" :key="item.id" @click="showClusterItem(item.id)">{{ item.id }}</li>
      </ul>
      <span v-else>尝试点击聚合数&le;10的点，显示聚合点位列表</span>
    </ol-overlay>
  </ol-map>
</template>

<style scoped></style>
