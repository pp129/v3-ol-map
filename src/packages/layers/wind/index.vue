<script setup lang="ts">
import OlMap from "@/packages/lib";
import Map from "ol/Map";
import { WindLayer } from "ol-wind";
import { inject, onMounted, onUnmounted, shallowRef, unref, watch, watchEffect } from "vue";
import { WindData, WindLayerEvent, WindLayerOptions } from "@/packages/types/Wind";
import { Vector, Field } from "wind-core";
import useBaseLayer from "@/packages/layers/baseLayer";
import MapBrowserEvent from "ol/MapBrowserEvent";

defineOptions({
  name: "OlWind",
});

const VMap = inject("VMap") as OlMap;
const map: Map = unref(VMap).map;
const props = withDefaults(defineProps<WindLayerOptions>(), {
  forceRender: true,
});
const layer = shallowRef<WindLayer | null>();
const emits = defineEmits<{
  (e: "mount", layer: WindLayer): void;
  (e: "singleclick", evt: WindLayerEvent): void;
  (e: "pointermove", evt: WindLayerEvent): void;
}>();

// 根据风速进行等级信息分类
function gps_getWindyLevel(v: number) {
  if (v < 0.3) {
    return 0;
  }
  if (v >= 0.3 && v < 1.6) {
    return 1;
  }
  if (v >= 1.6 && v < 3.4) {
    return 2;
  }
  if (v >= 3.4 && v < 5.5) {
    return 3;
  }
  if (v >= 5.5 && v < 8.0) {
    return 4;
  }
  if (v >= 8.0 && v < 10.8) {
    return 5;
  }
  if (v >= 10.8 && v < 13.9) {
    return 6;
  }
  if (v >= 13.9 && v < 17.2) {
    return 7;
  }
  if (v >= 17.2 && v < 20.8) {
    return 8;
  }
  if (v >= 20.8 && v < 24.5) {
    return 9;
  }
  if (v >= 24.5 && v < 28.5) {
    return 10;
  }
  if (v >= 28.5 && v < 32.7) {
    return 11;
  }
  if (v >= 32.7 && v < 37.0) {
    return 12;
  }
  if (v >= 37.0 && v < 41.5) {
    return 13;
  }
  if (v >= 41.5 && v < 46.2) {
    return 14;
  }
  if (v >= 46.2 && v < 51.0) {
    return 15;
  }
  if (v >= 51.0 && v < 56.1) {
    return 16;
  }
  if (v >= 56.1 && v < 61.2) {
    return 17;
  }
  if (v >= 61.2) {
    return 18;
  }
}
// 角度转换风向
function gps_getWindyDirection(angle: number) {
  // 风向为来向
  if ((angle >= 0 && angle <= 22.5) || (angle <= 360 && angle > 337.5)) {
    return "北风";
  }
  if (angle <= 337.5 && angle > 292.5) {
    return "西北风";
  }
  if (angle <= 292.5 && angle > 247.5) {
    return "西风";
  }
  if (angle <= 247.5 && angle > 202.5) {
    return "西南风";
  }
  if (angle <= 202.5 && angle > 157.5) {
    return "南风";
  }
  if (angle <= 157.5 && angle > 112.5) {
    return "东南风";
  }
  if (angle <= 112.5 && angle > 67.5) {
    return "东风";
  }
  if (angle <= 67.5 && angle > 22.5) {
    return "东北风";
  }
}

const init = () => {
  layer.value = new WindLayer(props.data, {
    windOptions: props.windOptions,
    forceRender: props.forceRender,
    fieldOptions: props.fieldOptions,
  });

  useBaseLayer(layer.value, props).onMounted();

  layer.value.setMap(map);
  map.on("singleclick", (evt: MapBrowserEvent<any>) => {
    const data = eventHandler(evt);
    const event = Object.assign({}, { ...evt }, { coordinate: evt.coordinate, pixel: evt.pixel });
    emits("singleclick", <WindLayerEvent>{ ...event, data });
  });
  map.on("pointermove", (evt: MapBrowserEvent<any>) => {
    const data = eventHandler(evt);
    const event = Object.assign({}, { ...evt }, { coordinate: evt.coordinate, pixel: evt.pixel });
    emits("pointermove", <WindLayerEvent>{ ...event, data });
  });
  emits("mount", layer.value);
};

const eventHandler = (evt: MapBrowserEvent<any>): WindData => {
  console.log(evt);
  //@ts-ignore
  const field: Field = layer.value?.field;
  const vector = field.valueAt(evt.coordinate[0], evt.coordinate[1]);
  if (vector) {
    const { u, v, m } = vector;
    const data = new Vector(u, v);
    return {
      u,
      v,
      m, // 风速 等价data.magnitude()
      /**
       * 流体方向 （这里指风向，范围为0-360º）
       * N is 0º and E is 90º
       * @returns {Number}
       */
      directionTo: data.directionTo(),
      /**
       * Angle in degrees (0 to 360º) From x-->
       * N is 0º and E is 90º
       * @returns {Number}
       */
      directionFrom: data.directionFrom(),
      windLevel: `${gps_getWindyLevel(m)}级`,
      windDirection: gps_getWindyDirection(data.directionFrom()),
    };
  } else {
    return null;
  }
};

watch(
  () => props.data,
  newVal => {
    layer.value?.setData(newVal);
  },
  { deep: true },
);
watch(
  () => props.windOptions,
  newVal => {
    if (newVal) layer.value?.setWindOptions(newVal);
  },
  { deep: true },
);
watchEffect(() => {
  useBaseLayer(layer.value, props);
});
const destroy = () => {
  map?.removeLayer(layer.value as any);
  layer.value = null;
};
const getData = () => {
  return layer.value?.getData();
};
const getWindOptions = () => {
  return layer.value?.getWindOptions();
};
defineExpose({
  getData,
  getWindOptions,
});
onMounted(() => {
  init();
});
onUnmounted(() => {
  destroy();
});
</script>

<template>
  <slot></slot>
</template>
