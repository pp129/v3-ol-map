import { Options } from "ol/interaction/Draw";

type ExtendType = "Rectangle" | "Square" | "" | undefined | null;

export declare type DrawType = Options["type"] | ExtendType;

declare const _default: import("vue").DefineComponent<
  {},
  {
    clear: (fast?: boolean | undefined) => void;
    setActive: (active: boolean) => void;
  }
>;

export declare type OlDrawInstance = InstanceType<typeof _default>;
