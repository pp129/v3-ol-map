import type { Options } from "ol/Overlay";

export interface OverlayOptions extends Options {
  overlayId?: string;
  data?: {};
}
