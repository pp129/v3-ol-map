import { FeatureStyle, VectorLayerOptions, WebGLStyle } from "../types";
import { inject, ref, shallowRef, unref, watch } from "vue";
import { Modify } from "ol/interaction";
import VectorLayer, { Options as LayerOptions } from "ol/layer/Vector";
import OlMap from "../lib";
import VectorSource, { Options as SourceOptions } from "ol/source/Vector";
import WebGLVectorLayer from "ol/layer/WebGLVector";
import { Projection } from "ol/proj";
import * as Format from "ol/format";
import { setFeatureStyle } from "../utils/style.ts";
import Feature from "ol/Feature";
import MapObjectEventTypes from "ol/MapBrowserEvent";
import type { Pixel } from "ol/pixel";
import type { Layer } from "ol/layer";
import { unByKey } from "ol/Observable";
import { DefaultStyle } from "ol/style/flat";
import { EmitFn } from "vue";

const useVectorLayer = (props: VectorLayerOptions, emit: EmitFn) => {
  const VMap = inject("VMap") as OlMap;
  const map = unref(VMap).map;
  const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
  let layer = shallowRef<VectorLayer>();
  let webGLLayer = shallowRef<WebGLVectorLayer>();
  let source = shallowRef<VectorSource>();
  let modifyObj = shallowRef<Modify | undefined>(undefined);
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
  const setModify = () => {
    if (layer && props.modify) {
      modifyObj.value = new Modify({
        hitDetection: layer.value,
        source: source.value,
        // features: new Collection(vector_source.value?.getFeatures()),
      });
      map.addInteraction(modifyObj.value);
      modifyEventsHandler(modifyObj.value);
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

  const init = (layer: VectorLayer | WebGLVectorLayer) => {
    layer.set("id", props.layerId);
    // 绑定事件
    eventList.forEach(listenerKey => {
      eventRender.value.push(
        map.on(listenerKey, (evt: MapObjectEventTypes<UIEvent>) => {
          eventHandler(listenerKey, evt);
        }),
      );
    });
    if (source.value) {
      setTimeout(() => {
        setModify();
      }, 0);
    }
    layer.on("sourceready", evt => {
      emit("sourceready", evt);
    });
    map.addLayer(layer);
  };

  const initVectorLayer = async () => {
    source.value = setSource();
    source.value?.on("addfeature", feature => {
      emit("addfeature", feature);
    });
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
    source.value?.on("addfeature", feature => {
      emit("addfeature", feature);
    });
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
  };
};

export default useVectorLayer;