import OlDraw from "../interaction/draw/draw";
import { Options } from "ol/interaction/Draw";

type ExtendType = "Rectangle" | "Square" | "" | undefined | null;

export declare type DrawType = Options["type"] | ExtendType;

export declare type ExposeDraw = {
  render: () => void;
  clear: () => void;
  setActive: (active: boolean) => void;
};

export declare type OlDrawInstance = InstanceType<typeof OlDraw>;
