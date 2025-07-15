import { defineComponent, h, inject, onMounted, PropType, Ref, unref, watch, shallowRef } from "vue";
import Pin from "@/packages/interaction/pin/index.vue";
import Draw, { createBox, createRegularPolygon, DrawEvent, Options } from "ol/interaction/Draw";
import OlMap from "@/packages/lib";
import { Modify, Snap } from "ol/interaction";
import Feature from "ol/Feature";
import { Geometry } from "ol/geom";
import type VectorLayer from "ol/layer/Vector";
import type VectorSource from "ol/source/Vector";
import type { DrawType } from "@/packages/types/Draw";
import { ExposeDraw } from "../../types";
import { ModifyEvent } from "ol/interaction/Modify";

const OlDraw = defineComponent({
  name: "OlDraw",
  props: {
    type: {
      type: String as PropType<DrawType>,
      default: "",
    },
    snap: {
      type: Boolean,
      default: false,
    },
    modify: {
      type: Boolean,
      default: false,
    },
    pin: {
      type: Boolean,
      default: false,
    },
    pinClass: {
      type: String,
      default: "",
    },
    pinTitleClass: {
      type: [Array, String] as PropType<string[] | string>,
      default: "",
    },
    pinBodyClass: {
      type: [Array, String] as PropType<string[] | string>,
      default: "",
    },
    pinFooterClass: {
      type: [Array, String] as PropType<string[] | string>,
      default: "",
    },
    once: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object as PropType<Partial<Options>>,
      default: () => ({}),
    },
  },
  // emits: ["drawend", "drawstart", "modifyend", "modifystart", "savePin"],
  emits: {
    drawend(payload: DrawEvent) {
      return payload;
    },
    drawstart(payload: DrawEvent) {
      return payload;
    },
    modifyend(payload: ModifyEvent) {
      return payload;
    },
    modifystart(payload: ModifyEvent) {
      return payload;
    },
    savePin(payload: any) {
      return payload;
    },
  },
  setup(props, { expose, emit }) {
    const VMap = inject("VMap") as OlMap;
    const map = unref(VMap).map;
    const layer = inject("ParentLayer") as Ref<VectorLayer>;
    let draw = shallowRef<Draw | undefined>();
    let modify: Modify;
    let snap: Snap;
    let drawFeature = shallowRef<Feature<Geometry> | undefined>(undefined);
    const drawEventsHandler = (draw: Draw) => {
      draw.on("drawend", event => {
        emit("drawend", event);
        if (props.pin) {
          drawFeature.value = event.feature;
          clearInteractions();
        }
      });
      draw.on("drawstart", event => {
        if (props.once) {
          clearSource();
        }
        emit("drawstart", event);
      });
    };

    const modifyEventsHandler = (modify: Modify) => {
      modify.on("modifyend", event => {
        emit("modifyend", event);
      });
      modify.on("modifystart", event => {
        emit("modifystart", event);
      });
    };
    const clearInteractions = () => {
      if (draw.value) map.removeInteraction(draw.value);
      if (snap) map.removeInteraction(snap);
      if (modify) map.removeInteraction(modify);
    };
    const init = () => {
      clearInteractions();
      drawFeature.value = undefined;
      if (props.type) {
        let drawOptions: Options;
        const source = layer.value.getSource() as VectorSource;
        let drawType: Options["type"];
        if (props.type === "Rectangle") {
          drawType = "Circle";
          drawOptions = {
            ...props.options,
            source,
            type: drawType,
            geometryFunction: createBox(), // 矩形
          };
        } else if (props.type === "Square") {
          drawType = "Circle";
          drawOptions = {
            ...props.options,
            source,
            type: drawType,
            geometryFunction: createRegularPolygon(4), // 正方形
          };
        } else {
          drawType = props.type;
          drawOptions = {
            ...props.options,
            source,
            type: drawType,
          };
        }
        draw.value = new Draw(drawOptions);
        draw.value.set("interactions_name", "Draw");
        map.addInteraction(draw.value);
        drawEventsHandler(draw.value);
        if (props.snap) {
          snap = new Snap({ source });
          snap.set("interactions_name", "Snap");
          map.addInteraction(snap);
        }
        if (props.modify) {
          modify = new Modify({ source });
          modify.set("interactions_name", "Modify");
          map.addInteraction(modify);
          modifyEventsHandler(modify);
        }
      }
    };
    const clearSource = () => {
      drawFeature.value = undefined;
      const source = layer.value.getSource() as VectorSource;
      source.clear();
    };
    const setActive = (active: boolean) => {
      draw.value?.setActive(active);
    };
    watch(
      () => props.type,
      () => {
        drawFeature.value = undefined;
        init();
      },
    );
    watch(
      () => props.once,
      () => {
        drawFeature.value = undefined;
        init();
      },
    );
    onMounted(() => {
      init();
    });

    expose({
      clear: clearSource,
      setActive: setActive,
    });

    // 如果pin属性为true，则渲染Pin组件（兴趣点、兴趣区域）
    const render = () => {
      if (props.pin) {
        let type: "Point" | "Polygon";
        if (!props.type) return null;
        if (props.type === "Point") {
          type = "Point";
        } else if (["Polygon", "Rectangle", "Square", "Circle"].includes(props.type)) {
          type = "Polygon";
        } else {
          return null;
        }
        return h("div", {}, [
          h(Pin, {
            name: "default",
            type,
            feature: drawFeature.value,
            pinClass: props.pinClass,
            titleClass: props.pinTitleClass,
            bodyClass: props.pinBodyClass,
            footerClass: props.pinFooterClass,
            // h函数调用子组件emit需要加on前缀
            onSave: (data: any) => {
              emit("savePin", data);
            },
          }),
        ]);
      } else {
        return null;
      }
    };

    return {
      render,
      clear: clearSource,
      setActive: setActive,
    } as ExposeDraw;
  },
  render() {
    return this.render();
  },
});

export default OlDraw;
