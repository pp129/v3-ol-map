import { defineComponent, inject, onMounted, PropType, shallowRef, unref, watch, ShallowRef } from "vue";
import OlMap from "@/packages/lib";
import VzPath, { Operators, PathInfo } from "@/packages/lib/path";
import type { VzPathOptions } from "@/packages";

const OlPath = defineComponent({
  name: "OlPath",
  props: {
    // 事件触发是否穿透
    bubble: {
      type: Boolean,
      default: true,
    },
    // 是否显示路径轨迹点
    showTracePoint: {
      type: Boolean,
      default: true,
    },
    tracePointsModePlay: {
      type: String as PropType<VzPathOptions["tracePointsModePlay"]>,
      default: "",
    },
    path: {
      type: Array as PropType<PathInfo[]>,
      default: () => {
        return [];
      },
    },
    options: {
      type: Object as PropType<Operators>,
      default: () => {
        return {};
      },
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    labelVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["load", "nodeClick", "nodeMouseover", "nodeMouseout", "pathClick", "pathMouseover", "pathMouseout", "move"],
  setup(props, { expose, emit }) {
    const VMap = inject("VMap") as OlMap;
    const map = unref(VMap).map;
    let pathObj: ShallowRef<VzPath | undefined> = shallowRef();
    watch(
      () => props.visible,
      newVal => {
        const group = map.getLayerGroup();
        if (group) {
          const collection = group.getLayers().getArray();
          const pathGroup = collection.find(item => item.get("type") === "vzTrackPath");
          if (pathGroup) pathGroup.setVisible(newVal);
        }
      },
    );
    watch(
      () => props.labelVisible,
      newVal => {
        const group = map.getLayerGroup();
        if (group) {
          const collection = group.getLayers().getArray();
          const pathGroup = collection.find(item => item.get("type") === "vzTrackPath");
          if (pathGroup) {
            pathGroup.getLayersArray().forEach(item => {
              if (item.get("id") && item.get("id").indexOf("pathLabelLayer") > -1) {
                item.setVisible(newVal);
              }
            });
          }
        }
      },
    );
    const init = (paths?: PathInfo[]) => {
      if ((paths && paths.length > 0) || (props.path && props.path.length > 0)) {
        const option = { ...props, ...{ mapObj: map, path: paths || props.path } };
        // console.log(option);
        const path = new VzPath(option);

        // 样式内容设置展示
        path.setTraceLineStyle({
          lineColor: option.options?.lineColor || "rgba(0, 0, 255, 0.6)",
          lineWidth: option.options?.lineWidth || 10,
        });
        path.setPassLineStyle({
          lineColor: option.options?.passLineColor || "red",
          lineWidth: option.options?.passLineWidth || 2,
        });
        path.setTraceNodeStyle({
          lineColor: option.options?.nodeStrokeColor || "#3399CC",
          lineWidth: option.options?.nodeStrokeWidth || 1.25,
          fillColor: option.options?.nodeFillColor || "rgba(255,255,255,0.4)",
        });

        pathObj.value = path;
        pathObj.value.getEvents().forEach(event => {
          pathObj.value?.on(event, e => {
            emit(event as any, e);
          });
        });
        emit("load", pathObj);
        if (props.autoPlay) {
          start();
        }
      }
    };
    const start = (index?: number) => {
      pathObj.value?.start(index);
    };
    const stop = () => {
      pathObj.value?.stop();
    };
    const pause = () => {
      pathObj.value?.pause();
    };
    const resume = () => {
      pathObj.value?.resume();
    };
    const getStatus = () => {
      return pathObj.value?._status;
    };
    const destroy = () => {
      pathObj.value?.destroy();
    };
    const setFitView = (fitView?: boolean) => {
      pathObj.value?.setFitView(fitView);
    };
    const getPaths = () => {
      return pathObj.value?.getPaths();
    };
    const setPaths = (paths: PathInfo[]) => {
      pathObj.value?.setPaths(paths);
    };
    const getSpeed = (): number | undefined => {
      return pathObj.value?.getSpeed();
    };
    const setSpeed = (speed: number) => {
      pathObj.value?.setSpeed(speed);
    };
    const getSpeedUp = () => {
      return pathObj.value?.getSpeedUp();
    };
    const setSpeedUp = (speedUp: number) => {
      pathObj.value?.setSpeedUp(speedUp);
    };
    const getPercent = () => {
      return pathObj.value?.getPercent();
    };
    const setPercent = (percent: number) => {
      pathObj.value?.setPercent(percent);
    };

    onMounted(() => {
      init();
    });

    expose({
      init,
      start,
      stop,
      pause,
      resume,
      getStatus,
      destroy,
      setFitView,
      getPaths,
      setPaths,
      getSpeed,
      setSpeed,
      getSpeedUp,
      setSpeedUp,
      getPercent,
      setPercent,
    });
  },
  render() {
    return null;
  },
});

export default OlPath;
