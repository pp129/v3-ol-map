import { Fill, Icon, RegularShape, Stroke, Style, Text, Circle } from "ol/style.js";
import { validObjKey } from "@/packages/utils";
import type Feature from "ol/Feature";
import type Map from "ol/Map";
import type {
  CircleStyleOptions,
  defaultTextStyleOptions,
  FeatureStyle,
  TextStyleOptions,
} from "@/packages/types/Style";

/**
 * 设置圆样式
 * @param option {CircleStyleOptions}
 * @return {CircleStyle}
 */
export const setCircleStyle = (option: CircleStyleOptions | undefined): Circle => {
  if (!option) {
    return new Circle({ radius: 2 });
  }
  const optionCircle = {
    radius: option.radius || 2,
    fill: new Fill(option.fill || { color: "blue" }),
    stroke: new Stroke(option.stroke || { color: "white" }),
  };
  return new Circle(optionCircle);
};

/**
 * 设置文本样式
 * @param option {TextStyleOptions}
 * @returns {Text}
 */
export const setText = (option: TextStyleOptions): Text => {
  const defaultOption: defaultTextStyleOptions = {
    font: "14px sans-serif",
    padding: [2, 5, 2, 5], // [top, right, bottom, left].
    ...option,
  };
  const textStyle = new Text(defaultOption);
  if (option.text) textStyle.setText(option.text);
  if (validObjKey(option, "fill")) {
    const fillStyle = new Fill(option.fill);
    textStyle.setFill(fillStyle);
  }
  if (validObjKey(option, "backgroundFill")) {
    const backgroundFillStyle = new Fill(option.backgroundFill);
    textStyle.setBackgroundFill(backgroundFillStyle);
  }
  if (validObjKey(option, "stroke")) {
    const strokeStyle = new Stroke(option.stroke);
    textStyle.setStroke(strokeStyle);
  }
  if (validObjKey(option, "backgroundStroke")) {
    const backgroundStrokeStyle = new Stroke(option.backgroundStroke);
    textStyle.setBackgroundStroke(backgroundStrokeStyle);
  }
  return textStyle;
};

/**
 * 获取样式
 * @param option
 */
export const setStyle = (option: FeatureStyle) => {
  const style = new Style();
  if (validObjKey(option, "fill")) {
    style.setFill(new Fill(option.fill));
  } else {
    style.setFill(
      new Fill({
        color: "rgba(67,126,255,0.15)",
      }),
    );
  }
  if (validObjKey(option, "stroke")) {
    style.setStroke(new Stroke(option.stroke));
  } else {
    style.setStroke(
      new Stroke({
        color: "rgba(67,126,255,1)",
        width: 1,
        // lineDash: [20, 10, 20, 10]
      }),
    );
  }
  if (validObjKey(option, "icon")) {
    style.setImage(new Icon(option.icon));
  }
  if (validObjKey(option, "circle")) {
    const circle = setCircleStyle(option.circle);
    style.setImage(circle);
  }
  if (validObjKey(option, "text")) {
    const optionText = option.text;
    if (optionText) {
      const textStyle = setText(optionText);
      style.setText(textStyle);
    }
  }
  if (validObjKey(option, "shape")) {
    let shapeFill;
    let shapeStroke;
    if (validObjKey(option.shape, "fill")) {
      shapeFill = new Fill(option.shape?.fill);
    }
    if (validObjKey(option.shape, "stroke")) {
      shapeStroke = new Stroke(option.shape?.stroke);
    }
    if (option.shape) {
      const shapeOptions = {
        ...option.shape,
        ...{
          stroke: shapeStroke,
          fill: shapeFill,
        },
      };
      const shape = new RegularShape(shapeOptions);
      style.setImage(shape);
    }
  }
  return style;
};

export const setFeatureStyle = (feature: Feature, style: FeatureStyle, map: Map) => {
  const featureStyle = setStyle(style);
  feature.setStyle(featureStyle);
  if (validObjKey(style, "styleFunction")) {
    feature.setStyle(function (feature, resolution) {
      return style.styleFunction && style.styleFunction(feature, resolution, map, featureStyle);
    });
  } else {
    feature.setStyle(featureStyle);
  }
};
