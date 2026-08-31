import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { setImmediate } from "node:timers/promises";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { createServer } from "vite";
import { createRenderer, h, nextTick, ref, shallowRef, ssrContextKey } from "vue";
import Observable from "ol/Observable.js";
import View from "ol/View.js";
import ImageLayer from "ol/layer/Image.js";
import TileLayer from "ol/layer/Tile.js";

let vite;
let OlWms;
const eventTypes = ["pointermove", "singleclick", "dblclick"];
const renderer = createRenderer({
  patchProp() {},
  insert() {},
  remove() {},
  createElement: () => ({}),
  createText: () => ({}),
  createComment: () => ({}),
  setText() {},
  setElementText() {},
  parentNode: () => null,
  nextSibling: () => null,
});

before(async () => {
  vite = await createServer({
    configFile: false,
    plugins: [vue()],
    resolve: { alias: { "@": resolve(process.cwd(), "src") } },
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const { default: component } = await vite.ssrLoadModule("/src/packages/layers/wms/index.vue");
  // The SSR build has no client render function; this component only renders its slot.
  OlWms = { ...component, render: () => null };
});
after(async () => vite.close());

async function mountWms(t, layerType = "ImageLayer", enabled) {
  const requests = [];
  t.mock.method(
    globalThis,
    "fetch",
    (url, options) =>
      new Promise((resolve, reject) => {
        requests.push({
          url: new URL(url),
          signal: options?.signal,
          resolve: data => resolve({ json: async () => data }),
          reject,
        });
      }),
  );
  const view = new View({ center: [0, 0], zoom: 3 });
  const target = { style: { cursor: "crosshair" } };
  const map = Object.assign(new Observable(), { getView: () => view, getTargetElement: () => target });
  const layer = layerType === "ImageLayer" ? new ImageLayer() : new TileLayer();
  layer.set("layerTypeName", layerType);
  const getData = t.mock.method(layer, "getData", () => new Uint8ClampedArray([0, 0, 0, 255]));
  const props = ref({
    url: "https://wms.test/wms",
    params: { LAYERS: "traffic", TIME: "initial" },
    ...(enabled === undefined ? {} : { featureInfoEnabled: enabled }),
  });
  const emitted = [];
  const app = renderer.createApp({
    setup: () => () =>
      h(OlWms, {
        ...props.value,
        onPointermove: (...args) => emitted.push(["pointermove", ...args]),
        onSingleclick: (...args) => emitted.push(["singleclick", ...args]),
        onDblclick: (...args) => emitted.push(["dblclick", ...args]),
      }),
  });
  app.provide("VMap", { map });
  app.provide(ssrContextKey, {});
  app.provide("ParentTileLayer", shallowRef(layer));
  app.mount({});
  t.after(() => app.unmount());
  await nextTick();
  const dispatch = (type, x = 0, dragging = false) => {
    const event = { type, coordinate: [x, 0], pixel: [x, 0], dragging };
    map.dispatchEvent(event);
    return event;
  };
  return { app, map, layer, props, requests, emitted, dispatch, getData, target, view };
}

test("WMS queries remain enabled by default and preserve event arguments", async t => {
  const { dispatch, requests, emitted } = await mountWms(t);
  for (const type of eventTypes) {
    const event = dispatch(type);
    const data = { type: "FeatureCollection", features: [{ id: type }] };
    const request = requests.at(-1);
    assert.equal(request.url.searchParams.get("REQUEST"), "GetFeatureInfo");
    assert.equal(request.url.searchParams.get("INFO_FORMAT"), "application/json");
    request.resolve(data);
    await setImmediate();
    assert.deepEqual(emitted.at(-1), [type, event, data]);
  }
});

for (const layerType of ["ImageLayer", "TileLayer"]) {
  test(`disabled ${layerType} sends no queries while GetMap retains in-place and replaced TIME updates`, async t => {
    const { layer, map, view, dispatch, requests, props, emitted, getData, target } = await mountWms(
      t,
      layerType,
      false,
    );
    let rawClicks = 0;
    map.on("singleclick", () => rawClicks++);
    for (const type of eventTypes) dispatch(type);
    await setImmediate();
    assert.equal(requests.length, 0);
    assert.equal(emitted.length, 0);
    assert.equal(rawClicks, 1);
    assert.equal(getData.mock.callCount(), 0);
    assert.equal(target.style.cursor, "crosshair");
    assert.equal(map.hasListener("pointermove"), false);

    // Keep the real WMS loaders; replace only the browser's image transport.
    const originalImage = Object.getOwnPropertyDescriptor(globalThis, "Image");
    globalThis.Image = class extends EventTarget {};
    t.after(() => {
      if (originalImage) Object.defineProperty(globalThis, "Image", originalImage);
      else delete globalThis.Image;
    });
    const source = layer.getSource();
    const urls = [];
    const capture = (_image, url) => urls.push(new URL(url));
    if (layerType === "ImageLayer") source.setImageLoadFunction(capture);
    else source.setTileLoadFunction(capture);
    const loadMap = () => {
      if (layerType === "ImageLayer") source.getImage([-100, -100, 100, 100], 1, 1, view.getProjection()).load();
      else source.getTile(3, 4, 4, 1, view.getProjection()).load();
    };
    loadMap();
    props.value.params.TIME = "mutated";
    await nextTick();
    loadMap();
    props.value.params = { LAYERS: "traffic", TIME: "replaced" };
    await nextTick();
    loadMap();
    assert.equal(layer.getSource(), source);
    assert.deepEqual(
      urls.map(url => url.searchParams.get("TIME")),
      ["initial", "mutated", "replaced"],
    );
    for (const url of urls) assert.equal(url.searchParams.get("REQUEST"), "GetMap");
    assert.equal(requests.length, 0);
  });
}

test("pointermove throttles to 200ms, retains the latest position and discards an aborted response", async t => {
  const { dispatch, requests, emitted } = await mountWms(t);
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 10_000 });
  dispatch("pointermove", 1);
  for (let x = 2; x <= 100; x++) dispatch("pointermove", x);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].signal?.aborted, true);
  requests[0].resolve({ stale: true });
  await setImmediate();
  assert.equal(emitted.length, 0);
  t.mock.timers.tick(199);
  assert.equal(requests.length, 1);
  t.mock.timers.tick(1);
  assert.equal(requests.length, 2);
  requests[1].resolve({ latest: true });
  await setImmediate();
  assert.equal(emitted.length, 1);
  assert.deepEqual(emitted[0][1].coordinate, [100, 0]);
  assert.deepEqual(emitted[0][2], { latest: true });
});

test("each query event cancels only its own superseded request", async t => {
  const { dispatch, requests, emitted } = await mountWms(t);
  dispatch("singleclick", 1);
  dispatch("dblclick", 2);
  dispatch("pointermove", 3);
  dispatch("singleclick", 4);
  assert.equal(requests[0].signal?.aborted, true);
  assert.equal(requests[1].signal?.aborted, false);
  assert.equal(requests[2].signal?.aborted, false);
  requests.forEach((request, index) => request.resolve({ index }));
  await setImmediate();
  assert.deepEqual(
    emitted.map(([type, , data]) => [type, data.index]),
    [
      ["dblclick", 1],
      ["pointermove", 2],
      ["singleclick", 3],
    ],
  );
});

for (const action of ["disable", "unmount", "TIME update"]) {
  test(`${action} cancels all queries and queued hover work without late emissions`, async t => {
    const { app, map, layer, dispatch, requests, emitted, props, target } = await mountWms(t);
    const source = layer.getSource();
    t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 10_000 });
    eventTypes.forEach(type => dispatch(type));
    dispatch("pointermove", 1);
    const count = requests.length;
    if (action === "disable") props.value.featureInfoEnabled = false;
    else if (action === "unmount") app.unmount();
    else props.value.params.TIME = "new";
    await nextTick();
    assert.ok(requests.every(request => request.signal?.aborted === true));
    requests.forEach(request => request.resolve({ stale: true }));
    t.mock.timers.tick(500);
    await setImmediate();
    assert.equal(emitted.length, 0);
    assert.equal(requests.length, count);
    if (action !== "TIME update") {
      assert.equal(map.hasListener("pointermove"), false);
      assert.equal(target.style.cursor, "crosshair");
    }
    if (action === "disable") {
      eventTypes.forEach(type => dispatch(type));
      assert.equal(requests.length, count);
      for (let cycle = 0; cycle < 2; cycle++) {
        props.value.featureInfoEnabled = true;
        await nextTick();
        const event = dispatch("singleclick");
        assert.equal(requests.length, count + cycle + 1);
        requests.at(-1).resolve({ cycle });
        await setImmediate();
        assert.deepEqual(emitted.at(-1), ["singleclick", event, { cycle }]);
        props.value.featureInfoEnabled = false;
        await nextTick();
      }
      assert.equal(layer.getSource(), source);
    }
  });
}

test("dragging cancels queued hover queries without disabling later hover", async t => {
  const { dispatch, requests, emitted } = await mountWms(t);
  t.mock.timers.enable({ apis: ["Date", "setTimeout"], now: 10_000 });
  dispatch("pointermove");
  dispatch("pointermove", 1);
  dispatch("pointermove", 2, true);
  assert.equal(requests[0].signal?.aborted, true);
  const count = requests.length;
  t.mock.timers.tick(250);
  assert.equal(requests.length, count);
  requests[0].resolve({ stale: true });
  await setImmediate();
  assert.equal(emitted.length, 0);
  dispatch("pointermove", 3);
  assert.equal(requests.length, count + 1);
});

test("request errors retain null results while abort rejections stay silent", async t => {
  const { dispatch, requests, emitted } = await mountWms(t);
  const errors = t.mock.method(console, "error", () => {});
  const event = dispatch("singleclick");
  requests[0].reject(new Error("network unavailable"));
  await setImmediate();
  assert.deepEqual(emitted, [["singleclick", event, null]]);
  assert.equal(errors.mock.callCount(), 1);
  dispatch("singleclick", 1);
  dispatch("singleclick", 2);
  requests[1].reject(new DOMException("Cancelled", "AbortError"));
  requests[2].resolve({ current: true });
  await setImmediate();
  assert.equal(errors.mock.callCount(), 1);
  assert.equal(emitted.length, 2);
  assert.deepEqual(emitted[1][2], { current: true });
});

test("disabling query cleanup does not overwrite another control's cursor", async t => {
  const { dispatch, props, target } = await mountWms(t);
  dispatch("pointermove");
  target.style.cursor = "grab";
  props.value.featureInfoEnabled = false;
  await nextTick();
  assert.equal(target.style.cursor, "grab");
});
