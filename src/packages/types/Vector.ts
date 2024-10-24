import VectorSource, { FeatureClassOrArrayOfRenderFeatures, Options as SourceOptions } from "ol/source/Vector";
import VectorLayer, { Options as LayerOptions } from "ol/layer/Vector";
import { DefaultStyle } from "ol/style/flat";
import * as Format from "ol/format.js";
import FeatureFormat from "ol/format/Feature";
import { Options as EsriJSONOptions } from "ol/format/EsriJSON";
import { Options as GeoJSONOptions } from "ol/format/GeoJSON";
import { ImageInformationResponse } from "ol/format/IIIFInfo";
import { Options } from "ol/proj/Projection";
import { WriteGetFeatureOptions } from "ol/format/WFS";
import type { FeatureStyle } from "@/packages/types/Style";
// import BaseVector from "ol/BaseVector.js";

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
export interface VectorLayerOptions extends defaultVectorOptions {
  layerId?: string;
  source?: VectorSourceOptions;
  layerStyle?: LayerOptions["style"] | DefaultStyle;
  featureStyle?: FeatureStyle;
  modify?: boolean;
}

declare const _default: import("vue").DefineComponent<
  {},
  {
    getLayer: () => VectorLayer;
    getFeatureById: (id: string) => FeatureClassOrArrayOfRenderFeatures<import("ol/Feature").FeatureLike> | null;
    removeFeatureById: (id: string) => void;
    getSource: () => VectorSource;
  }
>;

export declare type OlVectorInstance = InstanceType<typeof _default>;
