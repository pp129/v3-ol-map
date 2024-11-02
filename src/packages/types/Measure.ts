import OlMeasure from "../interaction/measure/measure";

export type MeasureType = "length" | "area" | "" | undefined | null;

export declare type ExposeMeasure = {
  clear: () => void;
  setActive: (active: boolean) => void;
};

export declare type OlMeasureInstance = InstanceType<typeof OlMeasure>;
