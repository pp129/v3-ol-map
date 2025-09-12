<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef } from "vue";
import {
  FeatureGeometry,
  GeoJSON,
  GeoJSONFeature,
  VectorLayerOptions,
  VMap,
  SimpleGeometry,
  utils,
  Position,
  OlVectorInstance,
} from "@/packages";
import icon from "@/assets/vue.svg";
import cluster2 from "@/assets/images/cluster2.png";
import cluster3 from "@/assets/images/cluster3.png";

const view: VMap["view"] = {
  zoom: 12,
  center: [118.11022, 24.490474],
};
const layerStyle: VectorLayerOptions["layerStyle"] = [
  {
    // 当geojson.features[index].properties.name的值为Point2时显示图标cluster2
    filter: ["==", ["get", "name"], "Point2"],
    style: {
      "text-value": ["get", "name"],
      "text-fill-color": "white",
      "text-background-fill-color": "orange",
      "text-offset-y": 28,
      "text-padding": [2, 8, 2, 8],
      "icon-src": cluster2,
    },
  },
  {
    filter: ["==", ["get", "name"], "Point3"],
    style: {
      "text-value": ["get", "name"],
      "text-fill-color": "white",
      "text-background-fill-color": "red",
      "text-offset-y": 28,
      "text-padding": [2, 8, 2, 8],
      "icon-src": cluster3,
    },
  },
  {
    filter: ["==", ["get", "name"], "Circle"],
    style: {
      "text-value": ["get", "radius_size"],
      "text-fill-color": "white",
      "text-background-fill-color": "black",
      "text-offset-y": 0,
      "text-font": "bold 16px serif",
      "text-padding": [2, 8, 2, 8],
      "stroke-color": "red", //圆的边框颜色
      "stroke-width": 4, //圆的边框宽度
      "fill-color": "rgba(0,255,255,0.5)", //圆的填充颜色
    },
  },
  {
    filter: ["==", ["get", "name"], "Polygon"],
    style: {
      "text-value": "多边形",
      "text-fill-color": "white",
      "text-background-fill-color": "green",
      "text-offset-y": 0,
      "text-font": "bold 16px serif",
      "text-padding": [2, 8, 2, 8],
      "stroke-color": "pink", //圆的边框颜色
      "stroke-width": 4, //圆的边框宽度
      "fill-color": "rgba(255,255,0,0.5)", //圆的填充颜色
    },
  },
  {
    else: true,
    style: {
      "text-value": ["get", "name"],
      "text-fill-color": "white",
      "text-background-fill-color": "red",
      "text-offset-y": 28,
      "text-padding": [2, 8, 2, 8],
      "icon-src": icon,
      "stroke-color": "black", //圆的边框颜色
      "stroke-width": 8, //圆的边框宽度
      "fill-color": "rgba(255,255,0,0.5)", //圆的填充颜色
    },
  },
];
let geojson = ref<GeoJSON>();
let geometryData = ref<FeatureGeometry[]>();
// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};
// 生成[1-3]范围的随机数
const mockRandom = () => {
  return Math.floor(Math.random() * 3) + 1;
};
const getVectorData = () => {
  const mockData = [
    {
      id: "1",
      name: "Point" + mockRandom(),
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
    {
      id: "2",
      name: "Point" + mockRandom(),
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
  ];
  const features: GeoJSONFeature[] = mockData.map(item => {
    return {
      id: item.id,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [item.longitude, item.latitude],
      },
      properties: item,
    };
  });
  geojson.value = {
    type: "FeatureCollection",
    features,
  };
  geometryData.value = [
    {
      type: "Circle",
      geometry: {
        center: mockCoordinates(),
        radius: 500,
      },
      properties: {
        name: "Circle",
        radius_size: "500",
      },
    },
    {
      type: "Polygon",
      geometry: {
        coordinates: [[mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()]],
      },
      properties: {
        name: "Polygon",
      },
    },
    {
      type: "LineString",
      geometry: {
        coordinates: [mockCoordinates(), mockCoordinates(), mockCoordinates(), mockCoordinates()],
      },
      properties: {
        name: "LineString",
      },
    },
  ];
};
let info = reactive({
  name: "",
});
let position = ref<Position>();
const onClickLayer = (...args: any[]) => {
  const [evt, feature] = args;
  if (feature) {
    const geom = feature.getGeometry() as SimpleGeometry;
    if (geom) {
      const type = geom.getType();
      info.name = feature.get("name");
      if (type === "Point") {
        position.value = geom.getCoordinates() || evt.coordinate;
      } else {
        const { topCenter } = utils.calculateCenter(geom);
        position.value = topCenter;
      }
    }
  }
};
let showTips = ref(false);
let mapInit = ref(false);

const handleDblclick = () => {
  getVectorData();
  showTips.value = false;
};
const vectorRef = shallowRef<OlVectorInstance>();
const onSourceReady = () => {
  if (!mapInit.value) showTips.value = true;
  mapInit.value = true;
  const layer = vectorRef.value?.getLayer();
  console.log(layer?.getSource());
};
const translateend = (...args: any[]) => {
  const [evt] = args;
  console.log(evt);
};
const onFeaturesLoadEnd = (...args: any[]) => {
  const [e] = args;
  console.log("load end", e);
};
const onFeaturesLoadStart = (...args: any[]) => {
  const [e] = args;
  console.log("load start", e);
};
const changefeature = (...args: any[]) => {
  const [e] = args;
  console.log("feature change", e);
};
const onchange = (...args: any[]) => {
  const [e] = args;
  console.log("change", e.target.getFeatures());
};
onMounted(() => {
  getVectorData();
});
</script>

<template>
  <ol-map :view="view" @dblclick="handleDblclick">
    <ol-tile tile-type="BAIDU" :z-index="0"></ol-tile>
    <ol-vector
      ref="vectorRef"
      :layer-style="layerStyle"
      :z-index="1"
      @singleclick="onClickLayer"
      @sourceready="onSourceReady"
      @featuresloadend="onFeaturesLoadEnd"
      @featuresloadstart="onFeaturesLoadStart"
      @changefeature="changefeature"
      @change="onchange"
    >
      <ol-feature :geo-json="geojson" />
    </ol-vector>
    <ol-vector
      :layer-style="layerStyle"
      :z-index="1"
      :translate="true"
      @singleclick="onClickLayer"
      @sourceready="onSourceReady"
      @translateend="translateend"
    >
      <ol-feature :geometries="geometryData" />
    </ol-vector>
    <ol-overlay :position="position" :class="['overlay']" positioning="bottom-center" :offset="[0, -20]">
      <i class="close" @click="position = undefined">&times;</i>
      <div class="content">
        {{ info.name }}
      </div>
    </ol-overlay>
  </ol-map>
  <Transition name="nested">
    <div v-show="showTips" class="tips">双击地图随机改变矢量图层要素~</div>
  </Transition>
</template>

<style scoped>
.overlay {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}
.overlay .content {
  z-index: 1;
}
.overlay .close {
  position: absolute;
  right: 2px;
  top: 2px;
  cursor: pointer;
  z-index: 2;
}

.tips {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 12px;
  font-size: 16px;
  color: #000;
}
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}
/* delay leave of parent element */
.nested-leave-active {
  transition-delay: 0.25s;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateY(100%) translateX(-50%);
  opacity: 0;
}
</style>
