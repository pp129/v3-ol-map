import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer as createHttpServer } from "node:http";
import { resolve } from "node:path";
import Feature from "ol/Feature.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { createRenderer, effectScope, h, nextTick, ref, shallowRef } from "vue";
import { createServer as createViteServer } from "vite";

let vite;

const renderer = createRenderer({
  patchProp() {},
  insert(child, parent) {
    parent.children ||= [];
    parent.children.push(child);
    child.parent = parent;
  },
  remove() {},
  createElement: type => ({ type, children: [] }),
  createText: text => ({ text }),
  createComment: text => ({ text }),
  setText(node, text) {
    node.text = text;
  },
  setElementText(node, text) {
    node.text = text;
  },
  parentNode: node => node.parent,
  nextSibling: () => null,
});

const point = coordinate => ({
  type: "Point",
  geometry: { coordinates: [coordinate, coordinate] },
});

const mountOlFeature = async ({ component, geometries, shallowWatch }) => {
  const source = new VectorSource({ useSpatialIndex: false });
  const layer = new VectorLayer({ source });
  const app = renderer.createApp({
    setup: () => () =>
      h(component, {
        geometries: geometries.value,
        ...(shallowWatch === undefined ? {} : { shallowWatch }),
      }),
  });
  app.provide("VMap", { map: {} });
  app.provide("ParentLayer", shallowRef(layer));
  app.mount({ children: [] });
  await nextTick();
  return { app, source };
};

before(async () => {
  vite = await createViteServer({
    configFile: false,
    resolve: { alias: { "@": resolve(process.cwd(), "src") } },
    server: { middlewareMode: true, hmr: false },
  });
});

after(async () => {
  await vite.close();
});

test("POST route requests parse the JSON response exactly once", async () => {
  let receivedBody;
  const server = createHttpServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", chunk => {
      body += chunk;
    });
    request.on("end", () => {
      receivedBody = JSON.parse(body);
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ paths: [{ distance: 12 }] }));
    });
  });

  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    const { requestRouteData } = await vite.ssrLoadModule("/src/packages/route/request.ts");
    const result = await requestRouteData(`http://127.0.0.1:${address.port}`, "POST", { points: [[1, 2]] });

    assert.deepEqual(receivedBody, { points: [[1, 2]] });
    assert.deepEqual(result, { paths: [{ distance: 12 }] });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("replacing one OlFeature instance keeps sibling features in the shared source", async () => {
  const { replaceOwnedFeatures } = await vite.ssrLoadModule("/src/packages/feature/source.ts");
  const sibling = new Feature({ name: "sibling" });
  const previous = new Feature({ name: "previous" });
  const next = new Feature({ name: "next" });
  const source = new VectorSource({ features: [sibling, previous] });

  const owned = replaceOwnedFeatures(source, [previous], [next]);

  assert.deepEqual(source.getFeatures(), [sibling, next]);
  assert.deepEqual(owned, [next]);
});

test("appending 300,000 owned features does not exceed the JavaScript argument limit", async () => {
  const { appendFeatures } = await vite.ssrLoadModule("/src/packages/feature/source.ts");
  const target = [];
  const features = Array.from({ length: 300_000 }, (_, index) => ({ index }));

  appendFeatures(target, features);

  assert.equal(target.length, 300_000);
  assert.equal(target[299_999], features[299_999]);
});

test("shallowWatch skips in-place geometry mutations and reacts to array replacement", async () => {
  const { default: OlFeature } = await vite.ssrLoadModule("/src/packages/feature/feature.ts");
  const geometries = ref([point(1)]);
  const { app, source } = await mountOlFeature({ component: OlFeature, geometries, shallowWatch: true });

  try {
    geometries.value.push(point(2));
    await nextTick();
    assert.equal(source.getFeatures().length, 1);

    geometries.value = [point(3), point(4)];
    await nextTick();
    assert.equal(source.getFeatures().length, 2);
  } finally {
    app.unmount();
  }
});

test("the default deep watch still reacts to in-place geometry mutations", async () => {
  const { default: OlFeature } = await vite.ssrLoadModule("/src/packages/feature/feature.ts");
  const geometries = ref([point(1)]);
  const { app, source } = await mountOlFeature({ component: OlFeature, geometries });

  try {
    geometries.value.push(point(2));
    await nextTick();
    assert.equal(source.getFeatures().length, 2);
  } finally {
    app.unmount();
  }
});

test("registered OpenLayers resources are disposed once when their Vue scope stops", async () => {
  const { useDisposables } = await vite.ssrLoadModule("/src/packages/hooks/disposables.ts");
  const disposed = [];
  const scope = effectScope();

  scope.run(() => {
    const { addDisposable } = useDisposables();
    addDisposable(() => disposed.push("layer"));
    addDisposable(() => disposed.push("interaction"));
  });

  scope.stop();
  scope.stop();

  assert.deepEqual(disposed, ["layer", "interaction"]);
});

test("exportPNG composes map canvases and downloads a normalized PNG filename", async () => {
  const { exportPNG } = await vite.ssrLoadModule("/src/packages/utils/index.ts");
  const operations = [];
  const outputContext = {
    globalAlpha: 1,
    fillStyle: "",
    setTransform: (...matrix) => operations.push(["transform", ...matrix]),
    fillRect: (...rectangle) => operations.push(["fill", ...rectangle]),
    drawImage: canvas => operations.push(["draw", canvas.id, outputContext.globalAlpha]),
  };
  const outputCanvas = {
    width: 0,
    height: 0,
    getContext: () => outputContext,
    toDataURL: () => "data:image/png;base64,map",
  };
  const link = {
    clickCount: 0,
    click() {
      this.clickCount++;
    },
  };
  const mapCanvases = [
    {
      id: "base",
      width: 100,
      height: 80,
      style: { opacity: "", transform: "matrix(1, 0, 0, 1, 0, 0)" },
      parentElement: { style: { opacity: "0.5", backgroundColor: "rgb(1, 2, 3)" } },
    },
    {
      id: "vector",
      width: 100,
      height: 80,
      style: { opacity: "0.75", transform: "", width: "50px", height: "40px" },
      parentElement: { style: { opacity: "0.25", backgroundColor: "" } },
    },
  ];
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: tag => (tag === "canvas" ? outputCanvas : link),
    body: {
      appendChild: node => operations.push(["append", node]),
      removeChild: node => operations.push(["remove", node]),
    },
  };
  let renderComplete;
  const map = {
    once(event, listener) {
      assert.equal(event, "rendercomplete");
      renderComplete = listener;
    },
    renderSync() {
      renderComplete();
    },
    getSize: () => [200, 100],
    getViewport: () => ({ querySelectorAll: () => mapCanvases }),
    getTargetElement: () => ({ id: "map-1" }),
  };

  try {
    exportPNG(map, "traffic-map");
  } finally {
    globalThis.document = originalDocument;
  }

  assert.deepEqual([outputCanvas.width, outputCanvas.height], [200, 100]);
  assert.deepEqual(
    operations.filter(([operation]) => operation === "draw"),
    [
      ["draw", "base", 0.5],
      ["draw", "vector", 0.25],
    ],
  );
  assert.deepEqual(
    operations.filter(([operation]) => operation === "transform"),
    [
      ["transform", 1, 0, 0, 1, 0, 0],
      ["transform", 0.5, 0, 0, 0.5, 0, 0],
    ],
  );
  assert.equal(link.download, "traffic-map.png");
  assert.equal(link.href, "data:image/png;base64,map");
  assert.equal(link.clickCount, 1);
});

test("exportPNG derives the default filename from the map target", async () => {
  const { exportPNG } = await vite.ssrLoadModule("/src/packages/utils/index.ts");
  const outputCanvas = {
    getContext: () => ({ globalAlpha: 1 }),
    toDataURL: () => "data:image/png;base64,map",
  };
  const link = { click() {} };
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: tag => (tag === "canvas" ? outputCanvas : link),
    body: { appendChild() {}, removeChild() {} },
  };
  let renderComplete;
  const map = {
    once: (event, listener) => {
      renderComplete = listener;
    },
    renderSync: () => renderComplete(),
    getSize: () => [200, 100],
    getViewport: () => ({ querySelectorAll: () => [] }),
    getTargetElement: () => ({ id: "map-42" }),
  };

  try {
    exportPNG(map);
  } finally {
    globalThis.document = originalDocument;
  }

  assert.equal(link.download, "map-export-map-42.png");
});
