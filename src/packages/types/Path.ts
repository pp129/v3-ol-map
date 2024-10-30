import type { Operators, PathInfo, VzPathOptions as Options } from "@/packages/lib/path.ts";

export declare type VzPathOptions = Options;

export interface PathOptions {
  bubble?: boolean;
  showTracePoint?: boolean;
  tracePointsModePlay?: "animation" | "skip";
  path?: PathInfo[];
  options?: Operators;
  autoPlay?: boolean;
  visible?: boolean;
  labelVisible?: boolean;
}

declare const _default: import("vue").DefineComponent<
  {},
  {
    init: (paths?: PathInfo[]) => void;
    start: (index?: number) => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
    getStatus: () => "stop" | "moving" | "pause";
    destroy: () => void;
    setFitView: (fitView?: boolean) => void;
    getPaths: () => PathInfo[];
    setPaths: (paths: PathInfo[]) => void;
    getSpeed: () => number | undefined;
    setSpeed: (speed: number) => void;
    getSpeedUp: () => number | undefined;
    setSpeedUp: (speedUp: number) => void;
    getPercent: () => number;
    setPercent: (percent: number) => void;
  }
>;

export declare type OlPathInstance = InstanceType<typeof _default>;
