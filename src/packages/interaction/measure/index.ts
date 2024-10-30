import { defineComponent, inject, onMounted, PropType, Ref, unref, watch } from "vue";
import { Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import { getArea, getLength } from "ol/sphere";
import Geometry from "ol/geom/geometry";
import { Modify } from "ol/interaction";
import { LineString, Point, Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import OlMap from "@/packages/lib";
import type { FeatureLike } from "ol/Feature";
import type { ExposeMeasure, MeasureType } from "@/packages/types/Measure";
import type VectorSource from "ol/source/Vector";

const OlMeasure = defineComponent({
  name: "OlMeasure",
  props: {
    type: {
      type: String as PropType<MeasureType>,
      default: "",
    },
    showSegments: {
      type: Boolean,
      default: false,
    },
    clearPrevious: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { expose, emit }) {
    const VMap = inject("VMap") as OlMap;
    const map = unref(VMap).map;
    const layer = inject("ParentLayer") as Ref<VectorLayer>;
    const source = unref(layer).getSource() as VectorSource;
    const style = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.2)",
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
      }),
    });
    const labelStyle = new Style({
      text: new Text({
        font: "14px Calibri,sans-serif",
        fill: new Fill({
          color: "rgba(255, 255, 255, 1)",
        }),
        backgroundFill: new Fill({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        padding: [3, 3, 3, 3],
        textBaseline: "bottom",
        offsetY: -15,
      }),
      image: new RegularShape({
        radius: 8,
        points: 3,
        angle: Math.PI,
        displacement: [0, 10],
        fill: new Fill({
          color: "rgba(0, 0, 0, 0.7)",
        }),
      }),
    });
    const tipStyle = new Style({
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "rgba(255, 255, 255, 1)",
        }),
        backgroundFill: new Fill({
          color: "rgba(0, 0, 0, 0.4)",
        }),
        padding: [2, 2, 2, 2],
        textAlign: "left",
        offsetX: 15,
      }),
    });
    const modifyStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0.4)",
        }),
      }),
      text: new Text({
        text: "拖拽进行修改",
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "rgba(255, 255, 255, 1)",
        }),
        backgroundFill: new Fill({
          color: "rgba(0, 0, 0, 0.7)",
        }),
        padding: [2, 2, 2, 2],
        textAlign: "left",
        offsetX: 15,
      }),
    });
    const segmentStyle = new Style({
      text: new Text({
        font: "12px Calibri,sans-serif",
        fill: new Fill({
          color: "rgba(255, 255, 255, 1)",
        }),
        backgroundFill: new Fill({
          color: "rgba(0, 0, 0, 0.4)",
        }),
        padding: [2, 2, 2, 2],
        textBaseline: "bottom",
        offsetY: -12,
      }),
      image: new RegularShape({
        radius: 6,
        points: 3,
        angle: Math.PI,
        displacement: [0, 8],
        fill: new Fill({
          color: "rgba(0, 0, 0, 0.4)",
        }),
      }),
    });
    const segmentStyles = [segmentStyle];
    let draw: Draw;
    let modify: Modify;
    let tipPoint: Geometry;
    const formatLength = function (line: Geometry) {
      const length = getLength(line, {
        projection: unref(map).getView().getProjection(),
      });
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " km";
      } else {
        output = Math.round(length * 100) / 100 + " m";
      }
      return output;
    };
    const formatArea = function (polygon: Geometry) {
      const area = getArea(polygon, {
        projection: unref(map).getView().getProjection(),
      });
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
      } else {
        output = Math.round(area * 100) / 100 + " m\xB2";
      }
      return output;
    };

    const styleFunction = (feature: FeatureLike, segments: boolean, drawType?: string, tip?: string) => {
      const styles = [];
      const geometry = feature.getGeometry();
      if (!geometry) return new Style();
      const type = geometry.getType();
      let point, label, line;
      if (!drawType || drawType === type || type === "Point") {
        styles.push(style);
        if (type === "Polygon") {
          point = (geometry as Polygon).getInteriorPoint();
          label = formatArea(geometry as Polygon);
          line = new LineString((geometry as Polygon).getCoordinates()[0]);
        } else if (type === "LineString") {
          point = new Point((geometry as LineString).getLastCoordinate());
          label = formatLength(geometry as LineString);
          line = geometry as LineString;
        }
      }
      if (segments && (line as LineString)) {
        let count = 0;
        if (!line) return new Style();
        line.forEachSegment(function (a, b) {
          const segment = new LineString([a, b]);
          const label = formatLength(segment);
          if (segmentStyles.length - 1 < count) {
            segmentStyles.push(segmentStyle.clone());
          }
          const segmentPoint = new Point(segment.getCoordinateAt(0.5));
          const segmentStylesIndex = segmentStyles[count];
          if (segmentStylesIndex) {
            segmentStylesIndex.setGeometry(segmentPoint);
            const segmentStylesIndexText = segmentStylesIndex.getText();
            segmentStylesIndexText?.setText(label);
            styles.push(segmentStyles[count]);
            count++;
          }
        });
      }
      if (label) {
        labelStyle.setGeometry(point as Point);
        const styleText = labelStyle.getText();
        styleText?.setText(label);
        styles.push(labelStyle);
      }
      if (tip && type === "Point" && !modify.getOverlay()?.getSource()?.getFeatures().length) {
        tipPoint = geometry as Geometry;
        tipStyle.getText()?.setText(tip);
        styles.push(tipStyle);
      }
      return styles;
    };

    // let draw; // global so we can remove it later

    const addInteraction = () => {
      const drawType = props.type === "area" ? "Polygon" : "LineString";
      const activeTip = "继续点击绘制 " + (props.type === "area" ? "区域" : "线段");
      const idleTip = "点击开始测量";
      let tip = idleTip;
      draw = new Draw({
        source: source,
        type: drawType,
        style: function (feature) {
          return styleFunction(feature, props.showSegments, drawType, tip);
        },
      });
      draw.on("drawstart", function () {
        if (props.clearPrevious) {
          source.clear();
        }
        modify.setActive(false);
        tip = activeTip;
      });
      draw.on("drawend", function () {
        modifyStyle.setGeometry(tipPoint);
        modify.setActive(true);
        map.once("pointermove", function () {
          modifyStyle.setGeometry("");
        });
        tip = idleTip;
      });
      modify.setActive(true);
      map.addInteraction(draw);
    };

    const init = () => {
      // const source = layer.value.getSource() as VectorSource;
      modify = new Modify({ source, style: modifyStyle });
      // map.on("pointermove", pointerMoveHandler);
      layer.value.setStyle(feature => {
        return styleFunction(feature, props.showSegments);
      });
      map.addInteraction(modify);
      if (props.type) {
        addInteraction();
      }
    };

    const clearSource = () => {
      const source = layer.value.getSource() as VectorSource;
      source.clear();
    };
    const setActive = (active: boolean) => {
      draw.setActive(active);
    };

    watch(
      () => props.type,
      nVal => {
        map.removeInteraction(draw);
        if (nVal) addInteraction();
      },
    );

    onMounted(() => {
      init();
    });

    expose({
      clear: clearSource,
      setActive: setActive,
    });

    return {
      clear: clearSource,
      setActive: setActive,
    } as ExposeMeasure;
  },
  render() {
    return null;
  },
});

export default OlMeasure;
