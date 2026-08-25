import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer as createHttpServer } from "node:http";
import Feature from "ol/Feature.js";
import VectorSource from "ol/source/Vector.js";
import { effectScope } from "vue";
import { createServer as createViteServer } from "vite";

let vite;

before(async () => {
  vite = await createViteServer({
    configFile: false,
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
