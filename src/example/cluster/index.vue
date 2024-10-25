<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import icon from "@/assets/vue.svg";
import cluster1 from "@/assets/images/cluster1.png";
import cluster2 from "@/assets/images/cluster2.png";
import cluster3 from "@/assets/images/cluster3.png";
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
const clusterStyle: ClusterLayerOptions["clusterStyle"] = [
  {
    min: 0, //自定义该聚合样式的点数量最小值，可省略
    max: 50, //自定义该聚合样式的点数量最大值，可省略
    icon: {
      src: cluster1, //该聚合样式图标
    },
  },
  {
    min: 50, //自定义该聚合样式的点数量最小值，可省略
    max: 100, //自定义该聚合样式的点数量最大值，可省略
    icon: {
      src: cluster2, //该聚合样式图标
    },
    text: {
      fill: {
        color: "red",
      },
    },
  },
  {
    min: 100, //自定义该聚合样式的点数量最小值，可省略
    max: 200, //自定义该聚合样式的点数量最大值，可省略
    icon: {
      src: cluster3, //该聚合样式图标
    },
  },
  {
    min: 200, //自定义该聚合样式的点数量最小值，可省略
    max: 1000, //自定义该聚合样式的点数量最大值，可省略
    icon: {
      src: cluster4, //该聚合样式图标
    },
  },
];
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

// 随机聚合点
const getClusterData = () => {
  let features: GeoJSONFeature[] = [];
  for (let i = 0; i < 800; i++) {
    features[i] = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: mockCoordinates(),
      },
      properties: {
        id: `random-${i + 1}`,
        name: `聚合要素-${i + 1}`,
      },
    };
  }
  clusterJson.value = { type: "FeatureCollection", features };
};
// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};

onMounted(() => {
  getClusterData();
});
</script>

<template>
  <ol-map :view="view" @dblclick="clusterOverlay.position = undefined">
    <ol-cluster
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
