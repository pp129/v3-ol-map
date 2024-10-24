import { Options } from "ol/layer/Heatmap";
import { Options as SourceOptions } from "ol/source/Vector";

export interface HeatmapOptions extends Omit<Options, "source"> {
  layerId?: string;
  source?: SourceOptions;
}
