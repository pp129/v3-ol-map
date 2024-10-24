import type { Options as CircleOptions } from "ol/style/Circle";
import type { Options as FillOptions } from "ol/style/Fill";
import type { Options as StrokeOptions } from "ol/style/Stroke";
import type { Options as TextOptions } from "ol/style/Text";
import type { Options as RegularShapeOptions } from "ol/style/RegularShape";
import type { Options as IconOptions } from "ol/style/Icon";
import type { RegularShape, Style } from "ol/style";
import type { StyleFunction } from "ol/style/Style";
import type { FeatureLike } from "ol/Feature";
import type Map from "ol/Map";

export interface CircleStyleOptions extends Pick<CircleOptions, "radius"> {
  fill?: FillOptions;
  stroke?: StrokeOptions;
}

export declare type defaultTextStyleOptions = Omit<
  TextOptions,
  "fill" | "stroke" | "backgroundFill" | "backgroundStroke" | "text"
>;
export interface TextStyleOptions extends defaultTextStyleOptions {
  fill?: FillOptions;
  backgroundFill?: FillOptions;
  stroke?: StrokeOptions;
  backgroundStroke?: StrokeOptions;
  text?: string;
}
interface RegularShapeStyleOptions {
  points: RegularShapeOptions["points"];
  radius: RegularShapeOptions["radius"];
  fill?: FillOptions;
  stroke?: StrokeOptions;
}
export interface StyleOptions {
  fill?: FillOptions;
  stroke?: StrokeOptions;
  icon?: IconOptions;
  image?: CircleOptions | RegularShape;
  text?: TextStyleOptions;
  circle?: CircleStyleOptions;
  shape?: RegularShapeStyleOptions;
  styleFunction?: StyleFunction;
}

type FeatureStyleOptions = Omit<StyleOptions, "styleFunction">;
export interface FeatureStyle extends FeatureStyleOptions {
  styleFunction?: (feature: FeatureLike, resolution: number, map: Map, style: Style) => Style | Array<Style> | void;
}
