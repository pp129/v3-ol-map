<script setup lang="ts">
import { inject, onMounted, ShallowRef, unref, watch } from "vue";
import OlMap from "@/packages/lib";
import { WMSOptions } from "@/packages/types/WMS";
import TileGrid from "ol/tilegrid/TileGrid.js";
import type { Layer, Tile } from "ol/layer";
import { ImageWMS, TileWMS } from "ol/source.js";
import MapBrowserEvent from "ol/MapBrowserEvent";
import ImageLayer from "ol/layer/Image";
import { useDisposables } from "@/packages/hooks/disposables";
import { unByKey } from "ol/Observable";
import { throttle } from "throttle-debounce";

defineOptions({
  name: "OlWms",
});

const VMap = inject("VMap") as OlMap;
const map = unref(VMap).map;
const { addDisposable } = useDisposables();
const layer = inject("ParentTileLayer") as ShallowRef<ImageLayer<import("ol/source/Image.js").default> | Tile | Layer>;

const props = withDefaults(defineProps<WMSOptions>(), { featureInfoEnabled: true });

const emit = defineEmits(["singleclick", "dblclick", "pointermove"]);
const queryEvents = ["pointermove", "singleclick", "dblclick"] as const;
type QueryEvent = (typeof queryEvents)[number];
let cancelPendingQueries: (() => void) | undefined;

const init = () => {
  if (layer.value) {
    const layerTypeName = layer.value?.get("layerTypeName");
    let tileGrid;
    let source: ImageWMS | TileWMS | undefined;
    if (props.tileGrid) {
      tileGrid = new TileGrid(props.tileGrid);
    }
    const { featureInfoEnabled: _featureInfoEnabled, ...sourceOptions } = props;
    const wmsOpt = { ...sourceOptions, tileGrid };
    if (layerTypeName === "ImageLayer") {
      source = new ImageWMS(wmsOpt);
      (layer.value as ImageLayer<import("ol/source/Image.js").default>).setSource(source);
    } else if (layerTypeName === "TileLayer") {
      source = new TileWMS(wmsOpt);
      (layer.value as Tile).setSource(source);
    }

    if (!source) return;

    const wmsSource = source;
    addDisposable(
      watch(
        () => props.featureInfoEnabled,
        (enabled, _previous, onCleanup) => {
          if (!enabled) return;

          const requests: Partial<Record<QueryEvent, AbortController>> = {};
          const abortRequest = (type: QueryEvent) => {
            requests[type]?.abort();
            delete requests[type];
          };
          const query = async (type: QueryEvent, evt: MapBrowserEvent<any>) => {
            abortRequest(type);
            const controller = new AbortController();
            requests[type] = controller;
            try {
              const featureInfo = await handleGetFeatureInfo(evt, wmsSource, controller.signal);
              // Aborting the transport alone cannot prevent an already resolved response from emitting.
              if (!controller.signal.aborted) emit(type, evt, featureInfo);
            } finally {
              if (requests[type] === controller) delete requests[type];
            }
          };
          const queryPointer = throttle(200, (evt: MapBrowserEvent<any>) => void query("pointermove", evt));
          const target = map.getTargetElement();
          const originalCursor = target.style.cursor;
          let lastCursor: string | undefined;
          const pointerMoveKey = map.on("pointermove", evt => {
            abortRequest("pointermove");
            if (evt.dragging) {
              queryPointer.cancel({ upcomingOnly: true });
              return;
            }
            const data: any = layer.value.getData(evt.pixel);
            const hit = data && data[3] > 0;
            lastCursor = hit ? "pointer" : "";
            target.style.cursor = lastCursor;
            queryPointer(evt);
          });
          const singleClickKey = map.on("singleclick", evt => void query("singleclick", evt));
          const doubleClickKey = map.on("dblclick", evt => void query("dblclick", evt));
          cancelPendingQueries = () => {
            queryPointer.cancel({ upcomingOnly: true });
            queryEvents.forEach(abortRequest);
          };
          onCleanup(() => {
            unByKey([pointerMoveKey, singleClickKey, doubleClickKey]);
            cancelPendingQueries?.();
            cancelPendingQueries = undefined;
            queryPointer.cancel();
            if (lastCursor !== undefined && target.style.cursor === lastCursor) target.style.cursor = originalCursor;
          });
        },
        { immediate: true, flush: "sync" },
      ),
    );
  }
};

const handleGetFeatureInfo = async (evt: MapBrowserEvent<any>, source: TileWMS | ImageWMS, signal: AbortSignal) => {
  const view = map.getView();
  const viewResolution = view.getResolution();
  if (!viewResolution) return;
  const url = source?.getFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection().getCode(), {
    INFO_FORMAT: "application/json",
  });
  if (url) {
    return fetch(url, { signal })
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        if (!signal.aborted) console.error("Error fetching feature info:", error);
        return null;
      });
  }
};

watch(
  () => props.params,
  newVal => {
    if (newVal) {
      updateParams(newVal);
    }
  },
  { deep: true, immediate: false },
);

const updateParams = (params: any) => {
  if (!layer.value) return;
  cancelPendingQueries?.();
  const source = layer.value.getSource() as TileWMS | ImageWMS;
  source.updateParams(params);
};

onMounted(() => {
  init();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped lang="scss"></style>
