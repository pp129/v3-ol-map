export type MeasureType = "length" | "area" | "" | undefined | null;

declare const _default: import("vue").DefineComponent<
  {},
  {
    clear: (fast?: boolean | undefined) => void;
    setActive: (active: boolean) => void;
  }
>;

export declare type OlMeasureInstance = InstanceType<typeof _default>;
