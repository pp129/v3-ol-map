<script setup lang="ts">
import useBaseLayer from "@/packages/layers/baseLayer";
import { nanoid } from "nanoid";
import { inject, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch, watchEffect } from "vue";
import { createDefaultStyle } from "ol/style/flat.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource, { Options as SourceOptions } from "ol/source/Vector.js";
import OlMap from "@/packages/lib";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import { unByKey } from "ol/Observable.js";
import { Modify } from "ol/interaction.js";
import * as Format from "ol/format.js";
import { Projection } from "ol/proj.js";
import { setFeatureStyle } from "@/packages/utils/style.ts";
import Feature from "ol/Feature";
import { FeatureStyle } from "@/packages/types/Style";
import type { Layer } from "ol/layer";
import type { Pixel } from "ol/pixel";
import { ExposeVector, VectorLayerOptions } from "@/packages/types/Vector";

const props = withDefaults(defineProps<VectorLayerOptions>(), {
  layerId: `vector-layer-${nanoid()}`,
  visible: true,
  modify: false,
  source: undefined,
  layerStyle: () => {
    return createDefaultStyle();
  },
  featureStyle: undefined,
});
const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
let layer = shallowRef<VectorLayer>();
let vector_source = shallowRef<VectorSource>();
let eventRender = ref<any[]>([]);
const eventList: ["singleclick", "pointermove"] = ["singleclick", "pointermove"];
const emit: any = defineEmits([
  "singleclick",
  "pointermove",
  "sourceready",
  "featuresloadend",
  "featuresloadstart",
  "addfeature",
  "modifyend",
  "modifystart",
  "change",
]);

let layerReady = ref(false);
let modifyObj = shallowRef<Modify | undefined>(undefined);

provide("ParentLayer", layer);

watchEffect(() => {
  useBaseLayer(layer.value, props);
});
watch(
  () => props.visible,
  nVal => {
    if (layer.value) {
      modifyObj.value?.setActive(nVal);
    }
  },
);
watch(
  () => props.layerStyle,
  nVal => {
    layer.value?.setStyle(nVal);
  },
  {
    deep: true,
  },
);
watch(
  () => props.source,
  () => {
    vector_source.value?.clear();
    if (layer.value) map.removeLayer(layer.value);
    init();
  },
);

const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
const modifyEventsHandler = (modify: Modify) => {
  modify.on("modifyend", event => {
    emit("modifyend", event, metersPerUnit);
  });
  modify.on("modifystart", event => {
    emit("modifystart", event, metersPerUnit);
  });
};
const setModify = () => {
  if (layer && props.modify) {
    modifyObj.value = new Modify({
      hitDetection: layer.value,
      source: vector_source.value,
      // features: new Collection(vector_source.value?.getFeatures()),
    });
    map.addInteraction(modifyObj.value);
    modifyEventsHandler(modifyObj.value);
  }
};
const setSource = (): VectorSource | undefined => {
  if (props.source?.featureFormat) {
    if (props.source?.url) {
      if (
        props.source?.featureFormat === "GeoJSON" ||
        props.source?.featureFormat === "EsriJSON" ||
        props.source?.featureFormat === "TopoJSON"
      ) {
        let options: { dataProjection: Projection | undefined; featureProjection: Projection | undefined } = {
          dataProjection: undefined,
          featureProjection: undefined,
        };
        if (props.source?.formatOptions?.dataProjection || props.source?.formatOptions?.featureProjection) {
          if (props.source?.formatOptions?.dataProjection) {
            options.dataProjection = new Projection(props.source?.formatOptions?.dataProjection);
          }
          if (props.source?.formatOptions?.featureProjection) {
            options.featureProjection = new Projection(props.source?.formatOptions?.featureProjection);
          }
        }
        return new VectorSource({
          url: props.source.url,
          format: new Format[props.source?.featureFormat]({
            ...props.source.formatOptions,
            ...options,
          }) as SourceOptions["format"],
        });
      }
    }
  } else {
    return new VectorSource(props.source);
  }
};
const init = () => {
  vector_source.value = setSource();
  vector_source.value?.on("addfeature", feature => {
    emit("addfeature", feature);
  });
  const styleOptions = props.layerStyle;
  if (!styleOptions || Object.keys(styleOptions).length === 0) {
    console.warn(`图层-${props.layerId}没有设置样式参数【layer-style】，图层要素可能无法正常显示！`);
  }
  if (props.featureStyle) {
    layer.value = new VectorLayer({
      ...props,
      source: vector_source.value,
      style: feature => {
        return setFeatureStyle(feature as Feature, props.featureStyle as FeatureStyle, map);
      },
    });
  } else {
    layer.value = new VectorLayer({
      ...props,
      source: vector_source.value,
      style: styleOptions, // https://openlayers.org/en/latest/apidoc/module-ol_style_flat.html
    });
  }
  layer.value.set("id", props.layerId);
  map.addLayer(layer.value);
  // 绑定事件
  eventList.forEach(listenerKey => {
    eventRender.value.push(
      map.on(listenerKey, (evt: MapObjectEventTypes<UIEvent>) => {
        eventHandler(listenerKey, evt);
      }),
    );
  });
  layer.value.on("sourceready", evt => {
    layerReady.value = true;
    emit("sourceready", evt);
  });
  if (vector_source.value) {
    setTimeout(() => {
      setModify();
    }, 0);
  }
};
const eventHandler = (listenerKey: any, evt: MapObjectEventTypes<UIEvent>) => {
  const { pixel } = evt;
  const feature = getFeatureAtPixel(pixel);
  const event = {
    ...evt,
    feature,
  };
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
const getFeatureById = (id: string) => {
  return vector_source.value?.getFeatureById(id);
};
const removeFeatureById = (id: string) => {
  const feature = getFeatureById(id);
  if (feature) {
    vector_source.value?.removeFeature(feature);
  }
};
const getSource = () => {
  return vector_source.value;
};

defineExpose(<ExposeVector>{
  getFeatureById,
  removeFeatureById,
  getSource,
  getLayer: () => {
    return layer.value;
  },
});

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

<style scoped></style>
