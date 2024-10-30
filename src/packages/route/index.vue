<script setup lang="ts">
import { computed, inject, onBeforeMount, ref, shallowRef, unref, watchEffect } from "vue";
import { OlVector, OlFeature, GeoJSONFeatureLineString } from "@/packages";
import qs from "qs";
import OlMap from "@/packages/lib";
import { arrowLine } from "@/packages/lib/arrowLine";
import { validObjKey } from "@/packages/utils";
import type { Methods, Params, RouteFeatureJson, RouteOptions, StopPoint, Type } from "@/packages/types/Route";
import type { Coordinate } from "ol/Coordinate";
import type { Position } from "geojson";
import type { OlVectorInstance, VectorLayerOptions } from "@/packages";
import type { FeatureStyle } from "@/packages/types/Style";
import { unByKey } from "ol/Observable.js";

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;

const props = withDefaults(defineProps<RouteOptions>(), {
  visible: true,
  method: "get",
  arrow: 50,
});

let vectorOptions = ref<VectorLayerOptions>();
const vectorRef = shallowRef<OlVectorInstance>();
let startFeatureJson = ref<RouteFeatureJson>();
let endFeatureJson = ref<RouteFeatureJson>();
let stopsFeaturesJson = ref<RouteFeatureJson>();
let routeFeatureJson = ref<GeoJSONFeatureLineString>();
let startPoint = ref<Coordinate>();
let startPointSet = ref(false);
let endPoint = ref<Coordinate>();
let endPointSet = ref(false);
let stopPoint = ref<Coordinate[]>();
let stopPointSet = ref(false);
const ableToSetRoute = computed(() => {
  return startPointSet.value && endPointSet.value;
});
const defaultEndCircleStyle: FeatureStyle = {
  circle: {
    radius: 14,
    fill: {
      color: "rgba(255, 0, 0, 0.5)",
    },
    stroke: {
      color: "rgba(255, 0, 0, 1)",
      width: 2,
    },
  },
  text: {
    text: "终",
    font: "bold 16px sans-serif",
    stroke: {
      color: "rgba(255, 255, 255, 1)",
      width: 3,
    },
  },
};
const defaultStopCircleStyle: FeatureStyle = {
  circle: {
    radius: 10,
    fill: {
      color: "rgba(255, 140, 0, 0.5)",
    },
    stroke: {
      color: "rgba(255, 140, 0, 1)",
      width: 2,
    },
  },
};
const defaultStartCircleStyle: FeatureStyle = {
  circle: {
    radius: 15,
    fill: {
      color: "rgba(0, 255, 0, 0.5)",
    },
    stroke: {
      color: "rgba(0, 255, 0, 1)",
      width: 2,
    },
  },
  text: {
    text: "起",
    font: "bold 16px sans-serif",
    stroke: {
      color: "rgba(255, 255, 255, 1)",
      width: 3,
    },
  },
};
const defaultLineStringStyle = {
  stroke: {
    color: "rgba(67, 126, 255, 0.6)",
    width: 10,
  },
};
// 处理对ol-layer-vector组件v-bind参数的警告
const vectorProps = () => {
  let options = { ...props } as RouteOptions;
  delete options.method;
  delete options.arrow;
  delete options.startStyle;
  delete options.lineStyle;
  delete options.endStyle;
  delete options.stopsStyle;
  delete options.params;
  delete options.url;
  delete options.type;
  vectorOptions.value = options as VectorLayerOptions;
};

watchEffect(() => {
  vectorProps();
});
onBeforeMount(() => {
  vectorProps();
});

// const emit = defineEmits(["resolve"]);
const emit = defineEmits<{
  (e: "resolve", data: any): void;
}>();

const getData = async (url: string, params: Params<Type, "get">) => {
  return fetch(url + "?" + params, { method: "get" })
    .then(res => res.json())
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
};
const postData = async (url: string, params: Params<Type, "post">) => {
  return fetch(url, {
    method: "post",
    body: JSON.stringify(params),
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      return Promise.resolve(res);
    })
    .catch(err => {
      console.log(err);
      return Promise.reject(err);
    });
};
const fetchData = async (params: Params<Type, Methods>) => {
  if (!props.url) return;
  if (props.method.toUpperCase() === "GET") {
    return getData(props.url, params)
      .then(res => {
        emit("resolve", {
          type: props.type,
          method: props.method,
          ...res,
        });
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  } else if (props.method.toUpperCase() === "POST") {
    return postData(props.url, params)
      .then(res => res.json())
      .then(res => {
        emit("resolve", {
          type: props.type,
          method: props.method,
          ...res,
        });
        return Promise.resolve(res);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }
};
const getArcgisParams = () => {
  /**
   * 在分析过程中，该组站点被加载为网络位置
   *
   * Syntax: stops=x1,y1; x2, y2; ...; xn, yn
   *
   * Example: stops=-122.4079, 37.78356; -122.404, 37.782
   */
  const points = combinePoints(
    startPoint.value as Coordinate,
    stopPoint.value as Coordinate[],
    endPoint.value as Coordinate,
  );
  if (points.length === 0) return;
  const stops = points.join(";");
  const params: Params<"arcgis", typeof props.method> = {
    ...props.params,
    stops,
  };
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    urlParams.append(encodeURIComponent(key), typeof value === "string" ? value : JSON.stringify(value));
  }
  if (props.method === "GET" || props.method === "get") {
    return urlParams;
  } else {
    return params;
  }
};
const getArcgisRouteData = async () => {
  const params = getArcgisParams();
  if (!params) return;
  return fetchData(params);
};
const setArcgisRoute = async () => {
  const { error, routes, stops } = await getArcgisRouteData();
  if (error) {
    return new Error(error.message);
  }
  if (routes) {
    const features: { geometry: { paths: Position[][] } } = routes.features[0];
    const route = features.geometry.paths[0].map(geometry => {
      return [geometry[0], geometry[1]];
    });
    let endPointIndex: number;
    if (stops) {
      let points: Position[] = [];
      stops.features.forEach((feature: any) => {
        const coordinates = [feature.geometry.x, feature.geometry.y];
        points.push(coordinates);
      });
      setStartFeature(points[0]);
      setEndFeature(points[points.length - 1]);
      const stopsPoints = points.slice(1, points.length - 1);
      const stopsFeatures = stopsPoints.map((stop, index) => {
        return {
          index,
          coordinate: stop,
        };
      });
      setStopFeatures(stopsFeatures);
    } else {
      endPointIndex = route.length - 1;
      setStartFeature(route[0]);
      setEndFeature(route[endPointIndex]);
    }
    setRouteFeature(route);
  }
};
const setGraphhopperRoute = async () => {
  const { paths } = await getGraphhopperRouteData();
  if (paths) {
    const { points } = paths[0];
    setRouteFeature(points.coordinates);
  }
};
const getGraphhopperRouteData = async () => {
  const params = getGraphhopperParams();
  if (!params) return;
  return fetchData(params);
};
const getGraphhopperParams = () => {
  const points = combinePoints(
    startPoint.value as Coordinate,
    stopPoint.value as Coordinate[],
    endPoint.value as Coordinate,
  );
  if (points.length === 0) return;
  if (props.method === "get" || props.method === "GET") {
    let params = qs.stringify(props.params);
    let stops = "&point=";
    points.forEach((point, index) => {
      stops = stops + point[1] + "," + point[0] + (index < points.length - 1 ? "&point=" : "");
    });
    params = params + stops;
    return params;
  } else {
    const params: Params<"graphhopper", "POST"> = {
      ...props.params,
      points,
    };
    console.log("graphhopper params", params);
    return params;
  }
};
const init = () => {
  if (props.type === "arcgis") {
    setArcgisRoute();
  } else if (props.type === "graphhopper") {
    setGraphhopperRoute();
  }
};
const setStartFeature = (coordinate?: number[]) => {
  vectorRef.value?.removeFeatureById("start");
  if (coordinate) {
    startPoint.value = coordinate;
    let style = defaultStartCircleStyle;
    if (validObjKey(props, "startStyle") && props.startStyle) {
      style = props.startStyle;
    }
    startFeatureJson.value = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
      properties: {
        id: "start",
        style,
      },
    };
  }
};
const setEndFeature = (coordinate?: number[]) => {
  vectorRef.value?.removeFeatureById("end");
  if (coordinate) {
    endPoint.value = coordinate;
    let style = defaultEndCircleStyle;
    if (validObjKey(props, "endStyle") && props.endStyle) {
      style = props.endStyle;
    }
    endFeatureJson.value = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinate,
      },
      properties: {
        id: "end",
        style,
      },
    };
  }
};
const setStopFeatures = (coordinates?: StopPoint[]) => {
  const source = vectorRef.value?.getSource();
  if (source) {
    const features = source.getFeatures();
    console.log(features);
    if (features && features.length > 0) {
      features.forEach(feature => {
        if (feature.get("isStops")) {
          vectorRef.value?.removeFeatureById(feature.get("id"));
        }
      });
    }
  }
  if (coordinates && coordinates.length > 0) {
    stopPoint.value = coordinates.map(item => item.coordinate);
    let style = defaultStopCircleStyle;
    if (validObjKey(props, "stopsStyle") && props.stopsStyle) {
      style = props.stopsStyle;
    }
    stopsFeaturesJson.value = {
      type: "FeatureCollection",
      features: coordinates.map(item => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: item.coordinate,
        },
        properties: {
          isStops: true,
          id: `stop_${item.index}`,
          style,
        },
      })),
    };
    console.log(stopsFeaturesJson.value);
  }
};
const setStartPoint = async (coordinate?: number[]) => {
  startPointSet.value = !!coordinate;
  setStartFeature(coordinate);
  reset();
};
const setEndPoint = async (coordinate?: number[]) => {
  endPointSet.value = !!coordinate;
  setEndFeature(coordinate);
  reset();
};
const setStopsPoints = async (coordinates?: StopPoint[]) => {
  stopPointSet.value = !!coordinates;
  setStopFeatures(coordinates);
  reset();
};

let eventRender = ref<any[]>([]);
const setRouteFeature = (route?: Position[]) => {
  vectorRef.value?.removeFeatureById("route");
  const source = vectorRef.value?.getSource();
  if (source) {
    const features = source.getFeatures();
    if (features && features.length > 0) {
      features.forEach(feature => {
        if (feature.get("isArrow")) {
          source.removeFeature(feature);
        }
      });
    }
  }
  // 移除事件
  eventRender.value.forEach(listenerKey => {
    unByKey(listenerKey);
  });
  eventRender.value = [];
  if (route) {
    routeFeatureJson.value = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route,
      },
      properties: {
        id: "route",
        style: {
          ...defaultLineStringStyle,
          ...props.lineStyle,
        },
      },
    };
    const layer = vectorRef.value?.getLayer();
    if (source && props.arrow) {
      arrowLine({
        map,
        coordinates: route,
        layer,
        pixel: props.arrow,
      });

      eventRender.value.push(
        layer?.on("postrender", () => {
          const zoom = map.getView().getZoom();
          source.getFeatures().forEach(feature => {
            if (feature.get("isArrow")) {
              source.removeFeature(feature);
            }
          });
          if (zoom && Math.round(zoom) === zoom) {
            arrowLine({
              map,
              coordinates: route,
              layer,
              pixel: props.arrow,
            });
          }
        }),
      );
    }
  }
};
const combinePoints = (start: Coordinate, stops: Coordinate[], end: Coordinate): Coordinate[] => {
  let points = [start];
  if (stops && stops.length > 0) points.push(...stops);
  points.push(end);
  return points;
};
const reset = () => {
  if (ableToSetRoute.value) {
    init();
  }
};
const clear = () => {
  startPointSet.value = false;
  endPointSet.value = false;
  stopPointSet.value = false;
  setStopFeatures();
  setStartFeature();
  setEndFeature();
  setRouteFeature();
  // routeFeatureJson.value = undefined;
  // startFeatureJson.value = undefined;
  // endFeatureJson.value = undefined;
  // stopsFeaturesJson.value = undefined;
  // const source = vectorRef.value?.getSource();
  // if (source) source.clear();
};

defineExpose({
  setStartPoint: setStartPoint,
  setEndPoint: setEndPoint,
  setStopsPoints: setStopsPoints,
  reset: reset,
  clear: clear,
});
</script>

<template>
  <ol-vector ref="vectorRef" v-bind="vectorOptions">
    <ol-feature :geo-json="startFeatureJson"></ol-feature>
    <ol-feature :geo-json="endFeatureJson"></ol-feature>
    <ol-feature :geo-json="stopsFeaturesJson"></ol-feature>
    <ol-feature :geo-json="routeFeatureJson"></ol-feature>
  </ol-vector>
</template>

<style scoped lang="scss"></style>
