"use client";
import { FeatureStyle, VectorLayerOptions, WebGLStyle } from "../types";
import { inject, ref, shallowRef, unref, watch } from "vue";
import { Modify, Select, Translate } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import type { Options as LayerOptions } from "ol/layer/Vector";
import OlMap from "../lib";
import VectorSource, { Options as SourceOptions } from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import { Projection } from "ol/proj";
import * as Format from "ol/format";
import { setFeatureStyle } from "../utils/style.ts";
import Feature from "ol/Feature";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import type { Pixel } from "ol/pixel";
import type Layer from "ol/layer/Layer";
import { unByKey } from "ol/Observable";
import { DefaultStyle } from "ol/style/flat";

export type VectorEmitsFnType = {
  (event: "singleclick", ...args: any[]): void;
  (event: "pointermove", ...args: any[]): void;
  (event: "sourceready", ...args: any[]): void;
  (event: "featuresloadend", ...args: any[]): void;
  (event: "featuresloadstart", ...args: any[]): void;
  (event: "featuresloaderror", ...args: any[]): void;
  (event: "addfeature", ...args: any[]): void;
  (event: "changefeature", ...args: any[]): void;
  (event: "removefeature", ...args: any[]): void;
  (event: "modifyend", ...args: any[]): void;
  (event: "modifystart", ...args: any[]): void;
  (event: "translateend", ...args: any[]): void;
  (event: "translatestart", ...args: any[]): void;
  (event: "translating", ...args: any[]): void;
  (event: "change", ...args: any[]): void;
};

const useVectorLayer = (props: VectorLayerOptions, emit: VectorEmitsFnType) => {
  const VMap = inject("VMap") as OlMap;
  const map = unref(VMap).map;
  const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
  let layer = shallowRef<VectorLayer>();
  let webGLLayer = shallowRef<WebGLVectorLayer>();
  let source = shallowRef<VectorSource>();
  let modifyObj = shallowRef<Modify | undefined>(undefined);
  let selectObj = shallowRef<Select | undefined>(undefined);
  let translateObj = shallowRef<Translate | undefined>(undefined);
  let eventRender = ref<any[]>([]);
  const eventList: ["singleclick", "pointermove"] = ["singleclick", "pointermove"];
  let layerReady = ref(false);

  watch(
    () => props.visible,
    nVal => {
      if (layer.value) {
        modifyObj.value?.setActive(nVal || false);
      }
    },
  );

  const modifyEventsHandler = (modify: Modify) => {
    modify.on("modifyend", event => {
      emit("modifyend", { ...event, metersPerUnit });
    });
    modify.on("modifystart", event => {
      emit("modifystart", { ...event, metersPerUnit });
    });
  };

  const translateEventsHandler = (translate: Translate) => {
    translate.on("translateend", event => {
      emit("translateend", { ...event, metersPerUnit });
    });
    translate.on("translatestart", event => {
      emit("translatestart", { ...event, metersPerUnit });
    });
    translate.on("translating", event => {
      emit("translating", { ...event, metersPerUnit });
    });
  };

  const setModify = () => {
    if (layer.value && props.modify) {
      modifyObj.value = new Modify({
        hitDetection: layer.value,
        source: source.value,
        // features: new Collection(vector_source.value?.getFeatures()),
      });
      map.addInteraction(modifyObj.value);
      modifyEventsHandler(modifyObj.value);

      // selectObj.value = new Select({
      //   layers: [layer.value],
      // });
      // map.addInteraction(selectObj.value);
    }
  };

  const clearModify = () => {
    if (modifyObj.value) {
      map.removeInteraction(modifyObj.value);
      modifyObj.value = undefined;
    }
  };

  const setTranslate = () => {
    if (layer.value && props.translate) {
      selectObj.value = new Select({
        layers: [layer.value],
      });
      map.addInteraction(selectObj.value);
      translateObj.value = new Translate({
        features: selectObj.value.getFeatures(),
      });
      map.addInteraction(translateObj.value);
      translateEventsHandler(translateObj.value);
    }
  };

  const setSource = () => {
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

  const eventHandler = (listenerKey: any, evt: MapObjectEventTypes) => {
    const { pixel } = evt;
    const feature = getFeatureAtPixel(pixel);
    // const event = {
    //   ...evt,
    //   feature,
    // };
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

  const init = (layer: VectorLayer | WebGLVectorLayer) => {
    layer.set("id", props.layerId);
    // 绑定事件
    eventList.forEach(listenerKey => {
      eventRender.value.push(
        map.on(listenerKey, (evt: MapObjectEventTypes) => {
          eventHandler(listenerKey, evt);
        }),
      );
    });
    if (source.value) {
      setTimeout(() => {
        setModify();
        setTranslate();
      }, 0);
    }
    layer.on("sourceready", evt => {
      emit("sourceready", evt);
    });
    // map.addLayer(layer);
  };

  const initSourceFeatureLisenter = () => {
    source.value?.on("addfeature", feature => {
      emit("addfeature", feature);
    });
    // changefeature
    source.value?.on("changefeature", feature => {
      emit("changefeature", feature);
    });
    // removefeature
    // source.value?.on("removefeature", feature => {
    //   emit("removefeature", feature);
    // });
    source.value?.on("featuresloadstart", features => {
      emit("featuresloadstart", features);
    });
    source.value?.on("featuresloadend", features => {
      emit("featuresloadend", features);
    });
  };

  const initVectorLayer = async () => {
    source.value = setSource();
    source.value?.on("change", e => {
      emit("change", e);
    });
    initSourceFeatureLisenter();
    const styleOptions = props.layerStyle as LayerOptions["style"] | DefaultStyle;
    if (!styleOptions || Object.keys(styleOptions).length === 0) {
      console.warn(`图层-${props.layerId}没有设置样式参数【layer-style】，图层要素可能无法正常显示！`);
    }
    if (props.featureStyle) {
      layer.value = new VectorLayer({
        ...props,
        source: source.value,
        style: feature => {
          return setFeatureStyle(feature as Feature, props.featureStyle as FeatureStyle, map);
        },
      });
    } else {
      layer.value = new VectorLayer({
        ...props,
        source: source.value,
        style: styleOptions, // https://openlayers.org/en/latest/apidoc/module-ol_style_flat.html
      });
    }
    init(layer.value);
    return Promise.resolve(layer.value);
  };

  const initWebglLayer = () => {
    source.value = setSource();
    source.value?.on("change", e => {
      emit("change", e);
    });
    initSourceFeatureLisenter();
    const styleOptions = props.layerStyle as WebGLStyle;
    if (!styleOptions || Object.keys(styleOptions).length === 0) {
      console.warn(`图层-${props.layerId}没有设置样式参数【layer-style】，图层要素可能无法正常显示！`);
    }
    webGLLayer.value = new WebGLVectorLayer({
      ...props,
      source: source.value,
      style: styleOptions,
    });
    init(webGLLayer.value);
    return Promise.resolve(webGLLayer.value);
  };

  const getFeatureById = (id: string) => {
    return source.value?.getFeatureById(id);
  };

  const removeFeatureById = (id: string) => {
    const feature = getFeatureById(id);
    if (feature) {
      source.value?.removeFeature(feature);
    }
  };

  const getSource = () => {
    return source.value;
  };

  return {
    initVectorLayer,
    initWebglLayer,
    dispose,
    getFeatureById,
    removeFeatureById,
    getSource,
    setModify,
    clearModify,
  };
};

export default useVectorLayer;
