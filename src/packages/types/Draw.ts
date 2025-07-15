import OlDraw from "../interaction/draw/draw";
import { Options } from "ol/interaction/Draw";

type ExtendType = "Rectangle" | "Square" | "" | undefined | null;

export declare type DrawType = Options["type"] | ExtendType;

export declare type ExposeDraw = {
  render: () => void;
  clear: () => void;
  setActive: (active: boolean) => void;
};

export declare type ModifyEvent = import("ol/interaction/Modify").ModifyEvent;
export declare type DrawEvent = import("ol/interaction/Draw").DrawEvent;

export declare type OlDrawInstance = InstanceType<typeof OlDraw>;
