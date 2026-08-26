# OlFeature Large Geometries Benchmark

- Runtime: Node.js 20.19.0, three isolated runs per size
- Scenario: `OlFeature` with `shallowWatch`, a reactive `geometries` ref, and a real OpenLayers `Cluster` source
- Assertions: initialization and replacement both finish without `RangeError`; the source count and replacement Feature ID are correct

`shallowWatch` defaults to `false`, preserving deep updates for existing callers that mutate arrays in place. Set it to `true` for large datasets and replace the `geometries` or `geoJson` reference when data changes.

| Points | Init median | Replace median | Init heap | Peak RSS | Final count |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10,000 | 38.0 ms | 49.1 ms | 26.4 MB | 190.3 MB | 10,000 |
| 100,000 | 229.4 ms | 379.5 ms | 259.9 MB | 819.9 MB | 100,000 |
| 300,000 | 591.0 ms | 1,243.3 ms | 781.5 MB | 2,242.3 MB | 300,000 |

Before raw-array iteration, the same 300,000-point benchmark took 1,142.1 ms to initialize and 3,183.5 ms to replace, with 2,455.8 MB peak RSS. Version 1.2.10 also reproduced `RangeError: Maximum call stack size exceeded` when spreading 285,000 or 300,000 entries into an array.

Run with `pnpm benchmark:feature`.
