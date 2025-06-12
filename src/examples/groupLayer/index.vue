<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { GeoJSON, VectorLayerOptions, VMap, GeoJSONFeature } from "@/packages";
import cluster1 from "@/assets/images/cluster1.png";
import cluster2 from "@/assets/images/cluster2.png";
import cluster3 from "@/assets/images/cluster3.png";
import icon from "@/assets/vue.svg";

const view: VMap["view"] = {
  zoom: 11,
  minZoom: 11,
  center: [118.12582777425764, 24.637526109241485],
  smoothExtentConstraint: true,
  constrainResolution: true,
};
const layerStyle: VectorLayerOptions["layerStyle"] = [
  {
    // 当geojson.features[index].properties.name的值为Point2时显示图标cluster2
    filter: ["==", ["get", "name"], "Point1"],
    style: {
      "text-value": ["get", "name"],
      "text-fill-color": "white",
      "text-background-fill-color": "orange",
      "text-offset-y": 28,
      "text-padding": [2, 8, 2, 8],
      "icon-src": cluster1,
    },
  },
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
const geojson1 = ref<GeoJSON>();
const geojson2 = ref<GeoJSON>();
const geojson3 = ref<GeoJSON>();
const geojson4 = ref<GeoJSON>();

const vectorLayers = ref([
  {
    id: "v_1",
    data: geojson1,
    visible: true,
    opacity: 1,
  },
  {
    id: "v_2",
    data: geojson2,
    visible: true,
    opacity: 1,
  },
  {
    id: "v_3",
    data: geojson3,
    visible: true,
    opacity: 1,
  },
]);
const groupOptions = ref({
  id: "group-layer",
  visible: true,
  opacity: 1,
});
const layerOptions = ref({
  id: "v_4",
  visible: true,
  opacity: 1,
});
// 生成厦门岛范围的随机经纬度
const mockCoordinates = () => {
  const x = 118.06 + Math.random() / 7;
  const y = 24.43 + Math.random() / 7;
  return [x, y];
};
const getVectorData = () => {
  const mockData = [
    {
      id: "1",
      name: "Point1",
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
    {
      id: "2",
      name: "Point2",
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
    {
      id: "3",
      name: "Point3",
      longitude: mockCoordinates()[0],
      latitude: mockCoordinates()[1],
    },
    {
      id: "4",
      name: "Point4",
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
  geojson1.value = {
    type: "FeatureCollection",
    features: [features[0]],
  };
  geojson2.value = {
    type: "FeatureCollection",
    features: [features[1]],
  };
  geojson3.value = {
    type: "FeatureCollection",
    features: [features[2]],
  };
  geojson4.value = {
    type: "FeatureCollection",
    features: [features[3]],
  };
};

const groupOpacityRef = useTemplateRef("groupOpacity");
const layerOpacityRef = useTemplateRef("layerOpacity");

const listener = () => {
  groupOpacityRef.value?.addEventListener("input", e => {
    groupOptions.value.opacity = (e.target as HTMLInputElement).valueAsNumber;
  });
  layerOpacityRef.value?.addEventListener("input", e => {
    layerOptions.value.opacity = (e.target as HTMLInputElement).valueAsNumber;
  });
};
const handleOpacity = (evt: Event, id: string) => {
  const target = evt.target as HTMLInputElement;
  const value = target.valueAsNumber;
  const layer = vectorLayers.value.find(layer => layer.id === id);
  if (layer) layer.opacity = value;
};
onMounted(() => {
  listener();
  getVectorData();
});
</script>

<template>
  <ol-map :view="view">
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-group-layer :id="groupOptions.id" :visible="groupOptions.visible" :opacity="groupOptions.opacity">
      <ol-vector
        v-for="layer in vectorLayers"
        :key="layer.id"
        :layer-id="layer.id"
        :layer-style="layerStyle"
        :visible="layer.visible"
        :opacity="layer.opacity"
      >
        <ol-feature :geo-json="layer.data" />
      </ol-vector>
    </ol-group-layer>
    <ol-vector
      :layer-id="layerOptions.id"
      :visible="layerOptions.visible"
      :opacity="layerOptions.opacity"
      :layer-style="layerStyle"
    >
      <ol-feature :geo-json="geojson4" />
    </ol-vector>
  </ol-map>
  <div id="layertree">
    <ul>
      <li>
        <span>Layer group</span>
        <fieldset>
          <label class="checkbox" for="visible1">
            visible <input id="visible1" v-model="groupOptions.visible" class="visible" type="checkbox" />
          </label>
          <label>
            opacity
            <input ref="groupOpacity" class="opacity" type="range" min="0" max="1" step="0.01" />
          </label>
        </fieldset>
        <ul>
          <li v-for="layer in vectorLayers" :key="layer.id">
            <span>layer {{ layer.id }}</span>
            <fieldset>
              <label class="checkbox" for="visible10">
                visible <input v-model="layer.visible" class="visible" type="checkbox" />
              </label>
              <label>
                opacity
                <input
                  class="opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  @input="evt => handleOpacity(evt, layer.id)"
                />
              </label>
            </fieldset>
          </li>
        </ul>
      </li>
      <li>
        <span>layer4</span>
        <fieldset>
          <label class="checkbox" for="visible0">
            visible <input v-model="layerOptions.visible" class="visible" type="checkbox" />
          </label>
          <label>
            opacity
            <input ref="layerOpacity" class="opacity" type="range" min="0" max="1" step="0.01" />
          </label>
        </fieldset>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#layertree {
  z-index: 999;
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
}
#layertree li > span {
  cursor: pointer;
}
#layertree label {
  display: block;
}
</style>
