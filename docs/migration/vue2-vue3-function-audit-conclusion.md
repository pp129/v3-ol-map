# Vue2 / Vue3 功能对照审查结论

## 审查基线

- Vue2：`/Users/feipan/Desktop/项目/测试/vue-openlayers-map-vite`，`master`，`c21bfb8ee6a00626cfccd2b0b225f85c36a62848`，`v-ol-map@1.19.12`。
- Vue3：`/Users/feipan/Desktop/项目/v3-ol-map`，`main`，`dd062caf803ae93e4839c2174a7f92748d557b08`，`v3-ol-map@1.2.10`。
- 审查日期：2026-08-25。
- 审查口径：对照发布入口、组件 props、事件、公开方法、数据请求、图层行为和卸载清理；“完整复刻”表示上述契约均可等价承接。

## 正式发布组件对照

| Vue2 组件 | Vue3 承载实现 | 结论 | 对照依据 |
| --- | --- | --- | --- |
| `VMap` | `OlMap` | 部分复刻 | 地图初始化、常用事件和移动动画已承接；视图控制、导出、测距及部分实例方法契约不等价。 |
| `BaseLayer` | `useBaseLayer` | 部分复刻 | 通用图层属性已内部化；Vue2 基类的公开方法、属性集及资源管理接口未作为组件 API 保留。 |
| `VVector` | `OlVector` + `OlFeature` | 部分复刻 | 矢量源、样式、编辑和要素装载已承接；选择、闪烁、悬浮和公开数据操作契约不等价。 |
| `VSuperCluster` | `OlCluster` + `OlFeature` | 部分复刻 | OpenLayers 聚合与 Supercluster 均有实现；事件、更新流程和实例接口不等价。 |
| `VDraw` | `OlDraw` | 部分复刻 | 常用绘制、吸附、修改及清除已承接；扩展图形、结束方式和事件载荷不等价。 |
| `VHeatmap` | `OlHeatmap` + `OlFeature` | 部分复刻 | 热力渲染参数和要素装载已承接；直接数据输入及事件契约不等价。 |
| `VTile` | `OlTile` + `OlWms` + `OlTiff` | 部分复刻 | 主流底图、XYZ、WMS 和 GeoTIFF 已拆分承接；Vue2 的完整底图预设与切换契约未等价保留。 |
| `VOverlay` | `OlOverlay` | 部分复刻 | 覆盖物创建、定位和卸载已承接；定位控制、实例获取及错误事件接口不等价。 |
| `VGroupLayer` | `OlGroupLayer` | 部分复刻 | 图层组嵌套和随组件卸载移除已承接；子图层管理方法与图层事件契约不等价。 |
| `VMeasure` | `OlMeasure` | 部分复刻 | 长度、面积、分段标注和清除已承接；类型取值、样式参数及测量事件契约不等价。 |
| `VVectorTile` | `OlVectorTile` | 部分复刻 | 矢量瓦片源、图层样式和源更新已承接；清空、刷新及变化事件接口不等价。 |
| `VWebGLVector` | `OlWebglVector` | 部分复刻 | WebGL 图层、数据源和基础要素操作已承接；直接 GeoJSON 数据、命中事件和批量方法不等价。 |
| `VImage` | `OlImage` + 子级数据源组件 | 部分复刻 | ImageLayer 容器已承接；Static、WMS、GeoImage 的统一入口和实例控制接口不等价。 |
| `VGraphic` | `OlFeature` | 部分复刻 | 点要素和样式可由矢量链路表达；Canvas 图形渲染、旋转换算及命中接口未等价承接。 |
| `VWfs` | `OlWfs` | 部分复刻 | WFS GetFeature POST 与要素写入已承接；自动加载控制、超时、重载、查询和状态事件不等价。 |
| `VEcharts` | `OlEcharts` | 部分复刻 | 图层创建、配置更新、显隐和卸载已承接；实例方法与交互开关契约不等价。 |
| `VRoute` | `OlRoute` | 部分复刻 | ArcGIS、GraphHopper、GET/POST 和路线渲染已承接；参数模型、事件名称及公开控制接口不等价。 |
| `VPath` | `OlPath` | 部分复刻 | 轨迹播放、暂停、恢复、速度、进度和销毁已承接；响应式路径更新、错误事件和部分方法语义不等价。 |

统计结果：正式发布的 18 个 Vue2 组件中，完整复刻 0 个，部分复刻 18 个，未复刻 0 个。

## 历史源码入口对照

Vue2 的非发布入口另含 4 个扩展组件：`VOverview` 由 `OlOverview` 部分承接；`VGDRoute` 由 `OlTraffic` 部分承接；`VTrack` 与瓦片式 `VTraffic` 没有等价组件。该范围统计为完整复刻 0 个、部分复刻 2 个、未复刻 2 个。

## 包级导出对照

Vue3 已提供插件安装、29 个组件、类型与 `utils` 命名空间。Vue2 发布入口直接导出的 `LayerManager`、`EventManager`、`StyleCache`、要素构造辅助函数和性能工具未保持同名同形的顶层导出。因此，包级组件名称、工具入口和实例 API 属于迁移式重构，不构成 Vue2 包 API 的完整兼容层。

## 验证记录

- Vue2 `npm run build:lib` 通过，发布入口确认为 `src/packages/index.js`。
- Vue3 `pnpm test` 通过：3 项测试全部通过，覆盖 Route POST 响应解析、Feature 实例隔离和 OpenLayers 资源清理。
- Vue3 源码 ESLint 与 `pnpm build:lib` 均通过。

## 最终结论

截至上述提交基线，Vue3 版本已形成可构建、可发布的 Vue 3 组件库，并承接了 Vue2 正式组件的核心地图能力；按公开组件契约和运行行为进行等价判定时，尚不能认定为 Vue2 版本的完整功能复刻。正式发布组件、历史扩展组件及包级导出三层均存在迁移后的接口或行为差异。
