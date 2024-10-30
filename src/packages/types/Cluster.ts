import OlCluster from "../layers/cluster/index.vue";
import type Feature from "ol/Feature";
import type { AnyProps, Options as SuperClusterOptions } from "supercluster";
import type { StyleOptions } from "./Style.ts";

export interface ClusterStyle extends StyleOptions {
  min?: number;
  max?: number;
}
export interface Options extends Omit<import("ol/layer/Vector").Options, "source"> {
  layerId?: string;
  source?: import("ol/source/Vector").Options;
  clusterOptions?: import("ol/source/Cluster").Options<Feature>;
  clusterStyle?: ClusterStyle | ClusterStyle[];
  layerStyle?: import("ol/layer/Vector").Options["style"] | StyleOptions;
  superCluster?: SuperClusterOptions<AnyProps, AnyProps> | undefined;
}

export declare type ClusterLayerOptions = Options;

export declare type OlClusterInstance = InstanceType<typeof OlCluster>;
