# Vue2 / Vue3 组件兼容台账

## 基线与验收规则

- Vue2 权威来源：`/Users/feipan/Desktop/项目/测试/vue-openlayers-map-vite`，提交 `c21bfb8ee6a0`。
- 本轮修改前 Vue3 基线：提交 `7d7afce1333c`。
- 强制范围是 Vue2 `src/packages/index.js` 导出的 18 个组件。只有功能、props、events、公开方法、异常和卸载行为都等价，才能标记完成；存在同名 Vue3 文件不能作为完成证据。
- 只存在于 Vue2 `src/components/index.js` 的旧组件，找到真实调用方后才升级为强制范围。

## 正式发布组件矩阵

| Vue2 | Vue3 映射 | 当前状态 | 剩余验收工作 |
|---|---|---|---|
| `VMap` | `OlMap` | 部分完成 | P0 已修事件清理和 `pointermove`；仍需补性能监控、视图/控件 setter、Feature 写入、fit、导出、距离和 Overlay 方法。 |
| `BaseLayer` | 内部 `useBaseLayer` | 部分完成 | 恢复公开组件及图层/source/refresh 方法，或明确为破坏性移除。 |
| `VVector` | `OlVector` + `OlFeature` | 部分完成 | P0 已修数据所有权和清理；仍缺 select/deselect、flash、hover/批量样式、GeoJSON 事件及公开方法。 |
| `VSuperCluster` | `OlCluster` + `OlFeature` | 部分完成 | P0 已修图层和 Feature 清理；继续核对聚合事件、数据刷新和 `getLeaves`。 |
| `VDraw` | `OlDraw` | 部分完成 | P0 已修交互清理；继续核对直接 Draw 参数、单次结束、箭头、finish/remove 和事件载荷。 |
| `VHeatmap` | `OlHeatmap` + `OlFeature` | 部分完成 | P0 已修清理；继续核对 Feature 输入与 source/load 事件。 |
| `VTile` | `OlTile` + `OlWms` + `OlTiff` | 部分完成 | 必须保留已发布的 ArcGIS、PGIS、FJ、WMS、mask、overview 行为，并实现已声明但未分派的 `MAPBOX`。 |
| `VOverlay` | `OlOverlay` | 部分完成 | P0 已修清理；仍缺 error、`getOverlay` 和公开 dispose。 |
| `VGroupLayer` | `OlGroupLayer` | 部分完成 | P0 已修清理；仍缺 title、load/error、子图层 add/remove 方法。 |
| `VMeasure` | `OlMeasure` | 部分完成 | P0 已修交互清理；仍缺样式参数、modifiable、measuring/draw/modify 事件及方法。 |
| `VVectorTile` | `OlVectorTile` | 部分完成 | P0 已修图层清理；仍缺 update/clear/refresh 与点击、加载事件。 |
| `VWebGLVector` | `OlWebglVector` | 部分完成 | P0 已修图层/交互清理；仍缺数据更新和公开方法/事件。 |
| `VImage` | `OlImage` | 部分完成 | P0 已修清理和类型声明；仍需实现 GeoImage center/rotation/scale，或声明破坏性移除。 |
| `VGraphic` | `OlFeature` | 部分完成 | 已有几何渲染；仍缺 Canvas 图片加载、旋转、刷新、命中查询及 graphics 方法。 |
| `VWfs` | `OlWfs` | 部分完成 | P0 已加卸载取消；仍缺 load/error、timeout、reload/clear、样式/图层参数和响应校验。 |
| `VEcharts` | `OlEcharts` | 部分完成 | 仍缺 `getLayer`、`setOptions`、show/hide、refresh、dispose。 |
| `VRoute` | `OlRoute` | 部分完成 | P0 已修 POST 重复解析并加入真实 HTTP 回归；继续核对 stops/type/service 参数和结果事件。 |
| `VPath` | `OlPath` | 部分完成 | P0 已修 lint 和卸载销毁；继续核对播放事件、可见性、速度/进度和重复初始化。 |

## 包级 API 与旧组件范围

Vue2 还公开导出 `LayerManager`、`EventManager`、`StyleCache`、Feature/Style helpers 和性能 helpers。Vue3 目前只有组件、类型和缩减后的 `utils`，这些包级 API 仍属于强制兼容工作。

- `VOverview`、`VGDRoute`：保留现有 `OlOverview`、`OlTraffic`，找到调用方时补验收。
- `VTrack`、基于 Worker/瓦片的旧 `VTraffic`：目前排除；找到真实调用证据再迁移。
- 历史 `VTile` 预设：属于正式发布组件，不能按旧代码排除。

## 验证证据

P0 自动回归覆盖 Route POST JSON 解析、兄弟 Feature 隔离和资源只销毁一次。必跑命令为 `pnpm test`、`pnpm exec vue-tsc --noEmit`、`pnpm exec eslint "src/**/*.{ts,vue}" "tests/**/*.mjs"`、`pnpm build:lib`。ArcGIS/GraphHopper、WFS/WMS 和交通服务仍需真实接口端到端验收。
