<script setup lang="ts">
import { watch, ref, inject, Ref, onMounted, unref, shallowRef } from "vue";
import type VectorLayer from "ol/layer/Vector";
import { calculateCenter } from "@/packages/utils";
import Feature from "ol/Feature";
import { Geometry, Point } from "ol/geom";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import OlMap from "@/packages/lib";
import { Pixel } from "ol/pixel";
import type { Layer } from "ol/layer";

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const layer = inject("ParentLayer") as Ref<VectorLayer>;

type PinOptions = {
  type: "Point" | "Polygon";
  feature: Feature | undefined;
  pinClass?: string;
  titleClass?: string[] | string;
  bodyClass?: string[] | string;
  footerClass?: string[] | string;
};

const props = withDefaults(defineProps<PinOptions>(), {
  type: "Point",
  feature: undefined,
  pinClass: "overlay-pin",
  titleClass: "",
  bodyClass: "",
  footerClass: "",
});
const typeEnum = <Record<"Point" | "Polygon", string>>{
  Point: "点",
  Polygon: "区域",
};
let position = ref<number[] | undefined>(undefined);

const getFeaturePosition = (feature: Feature | undefined) => {
  if (feature) {
    if (feature.get("type") === "Point") {
      return (feature.getGeometry() as Point)?.getCoordinates();
    } else {
      const { topCenter } = calculateCenter(feature.getGeometry());
      return topCenter;
    }
  }
};

watch(
  () => props.feature,
  newVal => {
    pinName.value = "";
    pinRemark.value = "";
    saveFeature.value = undefined;
    position.value = undefined;
    console.log(newVal);
    if (newVal) {
      savePinType.value = (newVal.get("type") as "Point" | "Polygon") ? newVal.get("type") : props.type;
      position.value = getFeaturePosition(newVal);
    }
  },
);

// const typeName ;
let pinName = shallowRef("");
let pinRemark = shallowRef("");
let saveFeature = shallowRef<Feature<Geometry> | undefined>(undefined);
let savePinType = shallowRef<"Point" | "Polygon">("Point");
const emit = defineEmits(["save"]);
const ok = () => {
  const feature = saveFeature.value ? saveFeature.value : props.feature;
  feature?.set("name", pinName.value);
  feature?.set("remark", pinRemark.value);
  feature?.set("type", feature?.get("type") ?? props.type);
  feature?.set("position", getFeaturePosition(feature));
  const style =
    (feature?.getStyle() as Style) ||
    (new Style({
      fill: new Fill({ color: "rgba(255, 255, 255, 0.6)" }),
      stroke: new Stroke({ color: "#319FD3", width: 1 }),
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADdElEQVRYR8WWXYjcVBiG3zfJGb1oq4todXZnVOpsMlbRLtQK1p+CVNAbERQEqUVEVPy58EIpqFAQwasqVOhFWdrSIuiNUAQR/3ApVIr0hzozu93KJtktsgWRxeLmJPlKho52JzOTZIo2t+d7v/c5b76cHOIqP7zK/igEIADPlNWGyJBHQY4DHANlUcBZI4p/MubDqRqwXGRTuQAEUM0x9TIMvkXg1r4GIosA3rE9PUlA8oBkAsyO4Dq9Sh0GuTlPw3aN4Os1UfBUeQEXsjQDAZKdtypqCuR9WY3S63JcLelH1v2BPwdpBwI0q+pjgG8UN+8o5Ijt6gcJxP169AVorsXtKKkZkGYvsQDnKDIPYEO/mrYuxnOOHxwsDNCoqj0EX0oJRc4jlmec+fD7ZK09I6vVdgA7Aa7prhfBdN0L7EIAApjNqlokOHK5UCCBBU7U3OB0d8NWRW0U4CjIVKomsL7mBr/2guj5ChqjGKdZaqV3I7vrnn6t324aFXWI5LM9UnvB8fRkboDpivVQTOPHbgEh22xXHxgAsJ1kykgQ76i74Ye5AZqj1haYxncpQSwvOr7e2w+gVVXbBNyXSq4owGwZVW2V5nq8gs/qnk5HfKmwVVWfCPh6Krk4esL2o69yJ5AUNiqlaRK1FSIRgfBexw9OdjdL5gamOkWw1DW4emRZj9z8O/4qCGDtII0P0iJJTrb31JLe1znlZsashyPyc5A3pgcQXzpe8GShzzApPnsT1i5fo3ySVk+xSCTEcYBlArf0NYhlk+3rnwsDJIJWRU0KmRwyQz0i8k3d01sHiQf+C9rDaKqzA4/aAd2NWO4f9/XRoQESYbOidoN8dYgIvnDc4OksXeZ9oDGKG2iqMwCvz2r277osW6Gu3bEAL0uTCXAphVdAfprVrLPOOH7f9sOdeepzASR3wWZVHSM4kaNpy3aDuwiEOWrzX0pnymoiMnGs199uxcETx1vqfvhDHvOkJlcCnWbNMbULBt/s11xE9tc9/Xxe88IAv92Ga/+OSidIjHebCDDHC8Hdznks/WcA7cNpVN0jBn4BaayIPowfqC+ER4qYF07gn1dRsd4Fjcun/CPHDd4uaj40QPJVtKqlwwAeB+Rb29WPEYj+N4DEKLmMBqvUlBh6651zODeM+dAJdMxOA6X1QDCs+RUDXIlxR3sRcjswMD6XvKYAAAAASUVORK5CYII=",
      }),
    }) as Style);
  const textStyle =
    style?.getText() ||
    new Text({
      font: "16px Calibri,sans-serif",
      fill: new Fill({ color: "#000" }),
      padding: [2, 2, 2, 2],
      backgroundFill: new Fill({ color: "#fff" }),
    });
  textStyle.setText(pinName.value);
  style.setText(textStyle);
  feature?.setStyle(style);
  emit("save", { name: pinName.value, remark: pinRemark.value, type: savePinType.value, feature });
  position.value = undefined;
  pinName.value = "";
  pinRemark.value = "";
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

onMounted(() => {
  if (layer.value) {
    map.on("singleclick", (e: any) => {
      const feature = getFeatureAtPixel(e.pixel);
      if (feature) {
        saveFeature.value = feature as Feature;
        const type = feature.get("type");
        const name = feature.get("name");
        const remark = feature.get("remark");
        saveFeature.value.set("type", type);
        saveFeature.value.set("name", name);
        savePinType.value = type;
        pinName.value = name;
        pinRemark.value = remark;
        if (feature.get("position")) position.value = feature.get("position");
      }
    });
  }
});
</script>

<template>
  <ol-overlay :class-name="props.pinClass" :position="position" :offset="[0, -30]" positioning="bottom-center">
    <div class="title" :class="props.titleClass">兴趣{{ typeEnum[savePinType] }}</div>
    <div class="body" :class="props.bodyClass">
      <div class="form-item"><label for="name">名称:</label><input v-model="pinName" type="text" /></div>
      <div class="form-item"><label for="remark">备注:</label><input v-model="pinRemark" type="text" /></div>
    </div>
    <div class="footer" :class="props.footerClass">
      <button class="btn-ok" @click="ok">保存</button>
    </div>
  </ol-overlay>
</template>

<style>
.overlay-pin {
  padding: 10px;
  background: rgba(255, 255, 255, 1);
}
</style>
