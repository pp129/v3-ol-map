import { Options as SourceOptions } from "ol/source/Vector";
import VectorLayer, { Options as LayerOptions } from "ol/layer/Vector";
import { DefaultStyle } from "ol/style/flat";
import * as Format from "ol/format.js";
import FeatureFormat from "ol/format/Feature";
import { Options as EsriJSONOptions } from "ol/format/EsriJSON";
import { Options as GeoJSONOptions } from "ol/format/GeoJSON";
import { Options } from "ol/proj/Projection";
import { WriteGetFeatureOptions } from "ol/format/WFS";
import type { FeatureStyle } from "@/packages/types/Style";
import OlVector from "../layers/vector/index.vue";

type defaultVectorOptions = Omit<LayerOptions, "source" | "style">;

interface FormatOptions
  extends Omit<FeatureFormat, "dataProjection" | "readProjection">,
    EsriJSONOptions,
    Omit<GeoJSONOptions, "dataProjection" | "featureProjection"> {
  dataProjection?: Options;
  featureProjection?: Options;
}

export interface VectorSourceOptions extends SourceOptions {
  // format 是 Format里的类型名称
  featureFormat?: keyof typeof Format;
  formatOptions?: FormatOptions;
  wfsOptions?: WriteGetFeatureOptions;
}

export declare type WebGLStyle = import("ol/style/flat.js").FlatStyleLike;
export declare type FlatStyleLike = import("ol/style/flat.js").FlatStyleLike;
export interface VectorLayerOptions extends defaultVectorOptions {
  layerId?: string;
  source?: VectorSourceOptions;
  layerStyle?: LayerOptions["style"] | DefaultStyle | WebGLStyle;
  featureStyle?: FeatureStyle;
  modify?: boolean;
  translate?: boolean;
}

export interface ExposeVector {
  getFeatureById: (id: string) => import("ol/Feature").default | undefined;
  removeFeatureById: (id: string) => void;
  getSource: () => import("ol/source/Vector").default | undefined;
  getLayer: () => VectorLayer | undefined;
}

export declare type OlVectorInstance = InstanceType<typeof OlVector>;
