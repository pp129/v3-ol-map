<script setup lang="ts">
import { onMounted, ref, computed, provide, shallowRef, onBeforeUnmount } from "vue";
import OlMap from "@/packages/lib";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import { panTo as PanTo } from "@/packages/utils";
import { unByKey } from "ol/Observable.js";
import BaseLayer from "ol/layer/Base";
import type { VMap } from "@/packages/types/Map";
import type { AnimationOptions } from "ol/View";

defineOptions({
  name: "OlMap",
});

/**
 * 属性继承：ol/Map
 * https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
 * 私有属性：
 * width 地图容器宽度
 * height 地图容器高度
 */
interface Props extends VMap {
  width?: string | number;
  height?: string | number;
}
// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  target: "map",
  width: "100%",
  height: "100%",
});
// 容器DOM的id
const targetId = computed(() => {
  return typeof props.target === "string" ? props.target : props.target.id;
});
const load = ref(false);
let map = shallowRef<OlMap>();
const mapWidth = computed(() => {
  return typeof props.width === "number" ? `${props.width}px` : props.width;
});
const mapHeight = computed(() => {
  return typeof props.height === "number" ? `${props.height}px` : props.height;
});

const events: string[] = [
  "singleclick",
  "click",
  "dblclick",
  "pointerdrag",
  "contextmenu",
  "precompose",
  "postrender",
  "loadend",
  "loadstart",
  "moveend",
  "movestart",
];
const emit: any = defineEmits([
  "load",
  "changeZoom",
  "singleclick",
  "click",
  "dblclick",
  "pointerdrag",
  "contextmenu",
  "precompose",
  "postrender",
  "loadend",
  "loadstart",
  "moveend",
  "movestart",
]);
const init = () => {
  return new Promise((resolve, reject) => {
    map.value = new OlMap({ ...props });
    if (map.value.map) {
      resolve("success");
      load.value = true;
      emit("load");
    } else {
      reject(new Error("fail"));
    }
  });
};

let cursor = ref("");
let forceCursor = ref("");
const setCursor = (type: string) => {
  forceCursor.value = type;
};

// 绑定事件
const eventBinding = () => {
  // 鼠标移动事件 图层有要素时显示手型
  map.value?.map.on("pointermove", (evt: MapObjectEventTypes<UIEvent>) => {
    if (forceCursor.value) {
      cursor.value = forceCursor.value;
      return;
    }
    if (evt.dragging) {
      cursor.value = "";
      return;
    }
    const pixel = map.value?.map.getEventPixel(evt.originalEvent);
    if (pixel) {
      const hit = map.value?.map.hasFeatureAtPixel(pixel);
      const ele = map.value?.map?.getTargetElement();
      if (ele) cursor.value = hit ? "pointer" : "";
    }
  });
  // 层级变化
  map.value?.map.getView().once("change:resolution", () => {
    map.value?.map.once("moveend", (evt: any) => {
      zoomEnd(evt);
    });
  });
  // 无特殊处理的遍历绑定
  events.forEach(event => {
    map.value?.map.on(event as any, (evt: any) => {
      emit(event, evt, map.value?.map);
    });
  });
};
const zoomEnd = (evt: MapObjectEventTypes<UIEvent>) => {
  const params = {
    ...evt,
    zoom: map.value?.map.getView().getZoom(),
  };
  emit("changeZoom", params, map.value?.map);
  map.value?.map.once("moveend", (event: any) => {
    zoomEnd(event);
  });
};
const dispose = () => {
  // 移除事件
  events.forEach((listenerKey: any) => {
    unByKey(listenerKey);
  });
};
const getLayerById = (id: string) => {
  const layers = map.value?.map.getLayers().getArray();
  return layers?.find((layer: BaseLayer) => layer.get("id") === id);
};
const getMap = () => {
  return map.value?.map;
};
const panTo = (params: AnimationOptions) => {
  if (map.value?.map) PanTo(map.value?.map, params);
};
onMounted(() => {
  init().then(() => {
    eventBinding();
  });
});
onBeforeUnmount(() => {
  dispose();
});
defineExpose({
  map: map.value?.map,
  getMap,
  getLayerById,
  panTo,
  setCursor: setCursor,
});
provide("VMap", map);
</script>

<template>
  <div :id="targetId" :style="{ width: mapWidth, height: mapHeight, cursor: cursor }">
    <slot v-if="load"></slot>
  </div>
</template>

<style scoped></style>
