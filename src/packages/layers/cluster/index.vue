<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watchEffect } from "vue";
import useBaseLayer, { BaseLayerOptions } from "@/packages/layers/baseLayer";
import { nanoid } from "nanoid";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import OlMap from "@/packages/lib";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import { unByKey } from "ol/Observable.js";
import { Cluster } from "ol/source.js";
import CircleStyle from "ol/style/Circle.js";
import { Fill, Stroke, Style, Text } from "ol/style.js";
import { setStyle } from "@/packages/utils/style.ts";
import { validObjKey } from "@/packages/utils";
import Feature from "ol/Feature.js";
import type { FeatureStyle, StyleOptions } from "@/packages";
import type { Layer } from "ol/layer";
import type { Pixel } from "ol/pixel";
import type { ClusterLayerOptions, ClusterStyle } from "@/packages/types/Cluster";

defineOptions({
  name: "OlCluster",
});

const props = withDefaults(defineProps<ClusterLayerOptions>(), {
  layerId: "",
  visible: true,
  clusterOptions: () => {
    return {};
  },
  clusterStyle: () => {
    return {};
  },
  layerStyle: () => {
    return {};
  },
  superCluster: undefined,
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<VectorLayer>();
let vector_source = shallowRef<VectorSource>();
let cluster_source = shallowRef<Cluster<Feature>>();
let eventRender = ref<any[]>([]);
const eventList: any[] = ["singleclick", "pointermove"];
const emit: any = defineEmits([
  "singleclick",
  "pointermove",
  "sourceready",
  "featuresloadend",
  "featuresloadstart",
  "addfeature",
]);
let layerReady = ref(false);

provide("ParentLayer", layer);

watchEffect(() => {
  useBaseLayer(layer.value, props as BaseLayerOptions);
});

const clusterFeatureStyle = (style: ClusterStyle, text: string) => {
  const textStyle = { ...style.text, ...{ text } };
  return { ...style, ...{ text: textStyle } };
};
const init = () => {
  vector_source.value = new VectorSource({ ...props.source });
  if (props.superCluster) {
    const styleCache: any = {};
    const total = cluster_source?.value?.getSource()?.getFeatures().length || 0;
    layer.value = new VectorLayer({
      ...props,
      source: vector_source.value,
      style: feature => {
        // console.log(feature)
        const cluster = feature.get("cluster") || 0;
        const size = feature.get("point_count_abbreviated") || 0;
        let styles = styleCache[size];
        if (cluster) {
          if (!styles) {
            let styleOptions: any = {};
            styleOptions = {
              image: new CircleStyle({
                radius: 4,
                fill: new Fill({
                  color: "blue",
                }),
              }),
              text: new Text({
                font: "16px sans-serif",
                text: size.toString(),
              }),
            };
            // const { style } = this.cluster
            if (props.clusterStyle) {
              styleOptions = props.clusterStyle;
              // styles = setStyle(props.superCluster.style);
              // styles.getText().setText(size.toString());
              if (styleOptions instanceof Array) {
                styleOptions.forEach(e => {
                  let min = 0;
                  let max = total;
                  if (validObjKey(e, "min") || validObjKey(e, "max")) {
                    min = e.min;
                    max = e.max;
                    if (min < size && size <= max) {
                      styleOptions = clusterFeatureStyle(e, size.toString());
                    }
                  } else {
                    if (total > 0) {
                      const average = total / styleOptions.style.length;
                      for (let i = 0; i < styleOptions.style.length; i++) {
                        min = i * average;
                        max = average * (i + 1);
                        if (min < size && size <= max) {
                          styleOptions = clusterFeatureStyle(styleOptions.style[i], size.toString());
                        }
                      }
                    }
                  }
                });
                styles = setStyle(styleOptions as StyleOptions);
              } else {
                styleOptions = clusterFeatureStyle(styleOptions, size.toString());
                styles = setStyle(styleOptions);
              }
            } else {
              styles = new Style(styleOptions);
            }
            styleCache[size] = styles;
          }
        } else {
          styles = setStyle(props.layerStyle as FeatureStyle);
        }
        // console.log(styles)
        return styles;
      },
    });
    layer.value.set("superCluster", props.superCluster);
  } else {
    cluster_source.value = new Cluster({
      ...props.clusterOptions,
      source: vector_source.value,
    });
    const styleCache: any = {};
    const total = cluster_source?.value?.getSource()?.getFeatures().length || 0;
    layer.value = new VectorLayer({
      ...props,
      source: cluster_source.value,
      style: function (feature) {
        const size = feature.get("features").length;
        let style = styleCache[size];
        if (size > 1) {
          if (!style) {
            let styleOptions: any = {};
            styleOptions = props.clusterStyle;
            if (!styleOptions || Object.keys(styleOptions).length === 0) {
              styleOptions = {
                image: new CircleStyle({
                  radius: 20,
                  stroke: new Stroke({
                    color: "#fff",
                  }),
                  fill: new Fill({
                    color: "#3399CC",
                  }),
                }),
                text: new Text({
                  font: "16px sans-serif",
                  text: size.toString(),
                  fill: new Fill({
                    color: "#fff",
                  }),
                }),
              };
              style = new Style(styleOptions);
            } else {
              if (styleOptions instanceof Array) {
                styleOptions.forEach(e => {
                  let min = 0;
                  let max = total;
                  if (validObjKey(e, "min") || validObjKey(e, "max")) {
                    min = e.min;
                    max = e.max;
                    if (min < size && size <= max) {
                      styleOptions = clusterFeatureStyle(e, size.toString());
                    }
                  } else {
                    if (total > 0) {
                      const average = total / styleOptions.style.length;
                      for (let i = 0; i < styleOptions.style.length; i++) {
                        min = i * average;
                        max = average * (i + 1);
                        if (min < size && size <= max) {
                          styleOptions = clusterFeatureStyle(styleOptions.style[i], size.toString());
                        }
                      }
                    }
                  }
                });
                style = setStyle(styleOptions as StyleOptions);
              } else {
                styleOptions = clusterFeatureStyle(styleOptions, size.toString());
                style = setStyle(styleOptions);
              }
            }
            styleCache[size] = style;
          }
        } else {
          style = setStyle(props.layerStyle as FeatureStyle);
        }
        return style;
      },
    });
    layer.value.set("cluster", true);
  }
  const layerId = props.layerId || `vector-layer-${nanoid()}`;
  layer.value.set("id", layerId);
  map.addLayer(layer.value);
  // 绑定事件
  eventList.forEach(listenerKey => {
    eventRender.value.push(
      map.on(listenerKey, (evt: MapObjectEventTypes) => {
        eventHandler(listenerKey, evt);
      }),
    );
  });
  layer.value.on("sourceready", () => {
    layerReady.value = true;
    emit("sourceready", layer.value);
  });
};
const eventHandler = (listenerKey: string, evt: MapObjectEventTypes) => {
  const { pixel } = evt;
  const feature = getFeatureAtPixel(pixel);
  emit(listenerKey, evt, feature);
};
const getFeatureAtPixel = (pixel: Pixel) => {
  return map.forEachFeatureAtPixel(
    pixel,
    feature => {
      return feature;
    },
    {
      layerFilter: (vector_layer: Layer) => {
        return vector_layer.get("id") === layer.value?.get("id");
      },
    },
  );
};
const dispose = () => {
  // 移除事件
  eventRender.value.forEach(listenerKey => {
    unByKey(listenerKey);
  });
};

onMounted(() => {
  init();
});
onBeforeUnmount(() => {
  dispose();
});
</script>

<template>
  <slot v-if="layerReady"></slot>
</template>

<style scoped lang="scss"></style>
