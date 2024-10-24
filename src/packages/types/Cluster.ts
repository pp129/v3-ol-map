import type Feature from "ol/Feature";
import type { Options as LayerOptions } from "ol/layer/Vector";
import type { Options as SourceOptions } from "ol/source/Vector";
import type { Options } from "ol/source/Cluster";
import type { AnyProps, Options as SuperClusterOptions } from "supercluster";
import type { StyleOptions } from "./Style.ts";

export interface ClusterStyle extends StyleOptions {
  min?: number;
  max?: number;
}
export interface ClusterLayerOptions extends Omit<LayerOptions, "source"> {
  layerId?: string;
  source?: SourceOptions;
  clusterOptions?: Options<Feature>;
  clusterStyle?: ClusterStyle | ClusterStyle[];
  layerStyle?: LayerOptions["style"] | StyleOptions;
  superCluster?: SuperClusterOptions<AnyProps, AnyProps> | undefined;
}
