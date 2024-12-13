<script setup lang="ts">
import { nextTick, reactive, ref, shallowRef, watch } from "vue";
import {
  OlMap,
  OlTile,
  OlRoute,
  FeatureStyle,
  OlMapInstance,
  OlRouteInstance,
  RouteOptions,
  StopPoint,
  VMap
} from "v3-ol-map";

const view: VMap["view"] = {
  zoom: 12,
  center: [118.11022, 24.490474],
  smoothExtentConstraint: true,
  constrainResolution: true,
};
const routeRef = ref<OlRouteInstance>();
const mapRef = shallowRef<OlMapInstance>();
const routeTypes = [
  {
    name: "arcgis",
    value: "arcgis",
    url: "http://172.16.34.120:6080/arcgis/rest/services/luwang/luwang/NAServer/Route/solve",
  },
  { name: "graphhopper", value: "graphhopper", url: "http://172.16.34.29:8989/route" },
];
const handleRouteTypeChange = () => {
  console.log(111, routeParams.type);
  let routeType = routeTypes.find(x => x.value === routeParams.type);
  if (routeType) {
    routeParams.url = routeType.url;
    if (routeParams.type === "arcgis") {
      routeParams.params = {
        f: "pjson",
        returnStops: true,
        directionsLengthUnits: "esriNAUMeters",
        TravelMode: {
          type: "AUTOMOBILE",
        },
      };
    } else if (routeParams.type === "graphhopper") {
      routeParams.params = {
        locale: "zh-CN",
        points_encoded: false,
        profile: "car",
      };
    }
    nextTick(() => {
      routeRef.value?.reset();
    });
  }
};
const routeParams = reactive<RouteOptions>({
  type: "graphhopper",
  url: "http://172.16.34.29:8989/route",
  params: {
    locale: "zh-CN",
    points_encoded: false,
    profile: "car",
  },
});
const route = reactive<{ start: string; end: string; stops: StopPoint[] }>({
  start: "起点",
  end: "终点",
  stops: [{ index: 0, name: "途经点", coordinate: [] }],
});
const routeStartStyle: FeatureStyle = {
  icon: {
    src: "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/icon_point_start.png",
  },
};
const routeEndStyle = {
  icon: {
    src: "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/icon_point_end.png",
  },
};
const routeStopsStyle = {
  icon: {
    src: "https://raw.githubusercontent.com/pp129/v3-ol-map/refs/heads/main/src/assets/images/icon_point.png",
  },
};
let pointPick = ref("");
watch(
  () => pointPick.value,
  val => {
    if (val === "") {
      mapRef.value?.setCursor("");
    } else {
      mapRef.value?.setCursor("pointer");
    }
  },
);
let pointPickIndex = ref(0);
const pickStartPoint = () => {
  pointPick.value = "start";
};
const pickEndPoint = () => {
  pointPick.value = "end";
};
const pickStopsPoint = (index: number) => {
  pointPickIndex.value = index;
  pointPick.value = "stops";
};
const addStopsPoint = (index: number) => {
  route.stops.push({
    index: index + 1,
    name: "途经点",
    coordinate: [],
  });
};
const removeStopsPoint = (index: number) => {
  route.stops.splice(index, 1);
  routeRef.value?.setStopsPoints(route.stops).then(() => {
    pointPick.value = "";
  });
};
const clearRoute = () => {
  route.stops = [{ index: 0, name: "途经点", coordinate: [] }];
  routeRef.value?.clear();
};
const onRouteResolve = (data: any) => {
  console.log("onRouteResolve", data);
};
const handleClickMap = (event: any) => {
  if (pointPick.value === "start") {
    // route.start = event.coordinate.join(",");
    routeRef.value?.setStartPoint(event.coordinate).then(() => {
      pointPick.value = "";
    });
  } else if (pointPick.value === "end") {
    // route.end = event.coordinate.join(",");
    routeRef.value?.setEndPoint(event.coordinate).then(() => {
      pointPick.value = "";
    });
  } else if (pointPick.value === "stops") {
    route.stops[pointPickIndex.value].coordinate = event.coordinate;
    console.log(route.stops);
    routeRef.value?.setStopsPoints(route.stops).then(() => {
      pointPick.value = "";
    });
  }
};
</script>

<template>
  <ol-map ref="mapRef" class="map-container" :view="view" @singleclick="handleClickMap">
    <div class="box-style route-panel">
      <div class="inline">
        <!-- 选择类型 -->
        <select v-model="routeParams.type" @change="handleRouteTypeChange">
          <option v-for="item in routeTypes" :key="item.value" :value="item.value">{{ item.name }}</option>
        </select>
        <!-- 服务地址 -->
        <input v-model="routeParams.url" style="width: 100%" />
      </div>
      <!-- 起点 -->
      <div class="inline">
        <input v-model="route.start" placeholder="起点" readonly />
        <button @click="pickStartPoint">标记</button>
      </div>
      <!-- 途经点 -->
      <div v-for="(item, index) in route.stops" :key="index" class="inline">
        <input v-model="item.name" placeholder="途经点" readonly />
        <button @click="pickStopsPoint(index)">标记</button>
        <button @click="addStopsPoint(index)">添加</button>
        <button v-if="route.stops.length > 1" @click="removeStopsPoint(index)">删除</button>
      </div>
      <!-- 终点 -->
      <div class="inline">
        <input v-model="route.end" placeholder="终点" readonly />
        <button @click="pickEndPoint">标记</button>
      </div>
      <button style="width: 100%; margin: 0" @click="clearRoute">清除</button>
    </div>
    <ol-tile tile-type="BAIDU"></ol-tile>
    <ol-route
      ref="routeRef"
      :params="routeParams.params"
      :url="routeParams.url"
      :type="routeParams.type"
      :z-index="10"
      class-name="route-layer"
      method="GET"
      :start-style="routeStartStyle"
      :end-style="routeEndStyle"
      :stops-style="routeStopsStyle"
      @resolve="onRouteResolve"
    ></ol-route>
  </ol-map>
</template>

<style scoped>
.map-container {
  position: relative;
}
.box-style {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.route-panel {
  top: 8%;
  left: 1%;
  padding: 8px;
  width: 330px;
  z-index: 9;
}
.inline {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 8px;
}
input {
  height: 24px;
}
select {
  appearance: none;
  -webkit-appearance: none;
  padding: 0.5em;
  margin-right: 8px;
}
button {
  padding: 0.5em;
  margin-left: 8px;
}
</style>
