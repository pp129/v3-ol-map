import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import Cluster from "ol/source/Cluster.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { createRenderer, h, nextTick, ref, shallowRef } from "vue";
import { createServer as createViteServer } from "vite";

const counts = [10_000, 100_000, 300_000];
const workerCount = Number(process.env.FEATURE_BENCH_COUNT || 0);

if (!workerCount) {
  const results = counts.map(count =>
    JSON.parse(
      execFileSync(process.execPath, ["--expose-gc", fileURLToPath(import.meta.url)], {
        cwd: process.cwd(),
        env: { ...process.env, FEATURE_BENCH_COUNT: String(count) },
        encoding: "utf8",
      }),
    ),
  );
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

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

const makeGeometries = offset =>
  Array.from({ length: workerCount }, (_, index) => ({
    type: "Point",
    geometry: { coordinates: [offset + index / 1000, offset + index / 1000] },
    properties: { id: offset + index },
  }));

const round = value => Math.round(value * 10) / 10;
const megabytes = bytes => round(bytes / 1024 / 1024);
const collect = () => {
  global.gc();
  return process.memoryUsage().heapUsed;
};

const vite = await createViteServer({
  configFile: false,
  resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
  server: { middlewareMode: true, hmr: false },
});

try {
  const { default: OlFeature } = await vite.ssrLoadModule("/src/packages/feature/feature.ts");
  const vectorSource = new VectorSource();
  const clusterSource = new Cluster({ source: vectorSource });
  const layer = new VectorLayer({ source: clusterSource });
  layer.set("cluster", true);

  const geometries = ref(makeGeometries(0));
  const app = renderer.createApp({
    setup: () => () => h(OlFeature, { geometries: geometries.value, shallowWatch: true }),
  });
  app.provide("VMap", { map: {} });
  app.provide("ParentLayer", shallowRef(layer));

  const beforeInitialization = collect();
  const initializationStarted = performance.now();
  app.mount({ children: [] });
  await nextTick();
  const initializationMs = performance.now() - initializationStarted;
  assert.equal(vectorSource.getFeatures().length, workerCount);
  const afterInitialization = collect();

  const replacement = makeGeometries(workerCount);
  const beforeReplacement = collect();
  const replacementStarted = performance.now();
  geometries.value = replacement;
  await nextTick();
  const replacementMs = performance.now() - replacementStarted;
  const features = vectorSource.getFeatures();
  assert.equal(features.length, workerCount);
  assert.deepEqual(vectorSource.getFeatureById(workerCount).getGeometry().getCoordinates(), [workerCount, workerCount]);
  const afterReplacement = collect();

  app.unmount();
  console.log(
    JSON.stringify({
      count: workerCount,
      initializationMs: round(initializationMs),
      replacementMs: round(replacementMs),
      initializationHeapMb: megabytes(afterInitialization - beforeInitialization),
      replacementHeapMb: megabytes(afterReplacement - beforeReplacement),
      peakRssMb: round(process.resourceUsage().maxRSS / 1024),
      finalFeatureCount: features.length,
    }),
  );
} finally {
  await vite.close();
}
