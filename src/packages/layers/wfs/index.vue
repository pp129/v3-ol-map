<script setup lang="ts">
import { inject, onMounted, Ref, ShallowRef, unref } from "vue";
import OlMap from "@/packages/lib";
import VectorLayer from "ol/layer/Vector.js";
import { WFS, GeoJSON } from "ol/format.js";
import type { WFSOptions } from "@/packages/types/WFS";

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const layer = inject("ParentLayer") as ShallowRef<VectorLayer>;

const props = withDefaults(defineProps<WFSOptions>(), {
  options: () => {
    return {
      featureNS: "",
      featurePrefix: "",
      featureTypes: [],
      outputFormat: "application/json",
      maxFeatures: Infinity,
    };
  },
});

const addFeatures = () => {
  // generate a GetFeature request
  const featureRequest = new WFS().writeGetFeature({
    ...props.options,
    outputFormat: "application/json",
  });

  // then post the request and add the received features to a layer
  fetch(props.options.featureNS, {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest),
  })
    .then(function (response) {
      return response.json();
    })
    .then(json => {
      const features = new GeoJSON().readFeatures(json);
      if (layer && unref(layer)) {
        const source = unref(layer)?.getSource();
        if (source) source.addFeatures(features);
      }
      // map.getView().fit(vectorSource.getExtent());
    });
};

onMounted(() => {
  addFeatures();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
