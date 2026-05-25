# 热力图层 API

<cite>
**本文档引用文件**  
- [index.vue](file://src/packages/layers/heatmap/index.vue#L0-L150)
- [index.ts](file://src/packages/layers/heatmap/index.ts#L0-L5)
- [Heatmap.ts](file://src/packages/types/Heatmap.ts#L0-L6)
- [baseLayer/index.ts](file://src/packages/layers/baseLayer/index.ts#L0-L126)
- [examples/heatmap/index.vue](file://src/examples/heatmap/index.vue#L0-L97)
</cite>

## 目录
1. [核心属性配置](#核心属性配置)  
2. [数据源配置方式](#数据源配置方式)  
3. [热力图层动态更新机制](#热力图层动态更新机制)  
4. [rendercomplete事件与性能监控](#rendercomplete事件与性能监控)  
5. [典型应用场景示例](#典型应用场景示例)  
6. [Canvas与WebGL渲染模式对比](#canvas与webgl渲染模式对比)  
7. [大数据量优化建议](#大数据量优化建议)

## 核心属性配置

`OlHeatmap` 组件通过一系列核心 `props` 控制热力图的视觉表现效果，主要包括 `weight`、`radius`、`blur` 和 `gradient` 四个关键属性。

### weight 属性：要素权重映射

`:weight` 属性用于指定要素（Feature）中哪个字段作为热力图的权重值。该属性接受一个字符串，表示要素 `properties` 中的字段名。

- **默认值**：`"weight"`
- **作用**：权重值越大，该点对周围区域的热力贡献越强。
- **示例**：若数据中每个点都有一个 `value` 字段表示事件频次，则应设置 `:weight="'value'"`。

在 `src/examples/heatmap/index.vue` 中，通过动态计算最大值并归一化权重来优化显示效果：

```vue
<script setup>
const setWeight = (feature: any) => {
  const value: number = feature.get("value");
  return value / maxWeight.value; // 归一化处理
};
</script>
```

### radius 属性：热力点半径

`:radius` 属性定义每个热力点的影响半径（像素单位）。

- **默认值**：`8`
- **视觉影响**：`radius` 越大，热力扩散范围越广，颜色过渡更平滑；过小则可能导致热点不连续。
- **动态调整**：在 `examples/heatmap/index.vue` 中，根据地图缩放级别动态调整 `radius`，以保持不同层级下视觉效果一致：
  ```ts
  radius.value = 3 + (zoom - 11) * Math.pow(1.5, zoom - 11);
  ```

### blur 属性：模糊程度

`:blur` 属性控制热力图的模糊程度（像素单位）。

- **默认值**：`15`
- **视觉影响**：`blur` 值越大，热力图越柔和，边界越模糊；值过小则可能显得生硬、颗粒感强。
- **与 radius 关系**：通常 `blur` 应略小于 `radius`，以保证热力中心清晰。

### gradient 属性：颜色渐变

`:gradient` 属性定义热力图的颜色渐变方案。

- **默认值**：`["#00f", "#0ff", "#0f0", "#ff0", "#f00"]`（蓝→青→绿→黄→红）
- **配置方式**：接受一个颜色字符串数组，从低权重到高权重依次对应。
- **动态更新**：组件通过 `watch` 监听 `props.gradient` 变化，并调用 `layer.value?.setGradient(nVal)` 实时更新。

**Section sources**
- [index.vue](file://src/packages/layers/heatmap/index.vue#L43-L57)

## 数据源配置方式

热力图的数据源通过 `source` prop 配置，其类型为 `ol/source/Vector` 的选项对象。

### 配置方式

```ts
interface HeatmapOptions extends Omit<import("ol/layer/Heatmap").Options, "source"> {
  layerId?: string;
  source?: import("ol/source/Vector").Options;
}
```

- **数据格式**：通常为 GeoJSON 格式的点要素集合（`FeatureCollection`）。
- **示例**：
  ```json
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [118.12, 24.63] },
        "properties": { "value": 100 }
      }
    ]
  }
  ```

### 数据绑定

在模板中，通过 `<ol-feature>` 组件将 GeoJSON 数据绑定到 `<ol-heatmap>`：

```vue
<ol-heatmap :source="vectorSource" :weight="'value'">
  <ol-feature :geo-json="heatmapJson" />
</ol-heatmap>
```

**Section sources**
- [Heatmap.ts](file://src/packages/types/Heatmap.ts#L0-L6)
- [examples/heatmap/index.vue](file://src/examples/heatmap/index.vue#L57-L97)

## 热力图层动态更新机制

当数据源 `source` 发生变化时，组件会自动重新初始化图层以实现动态更新。

### 更新流程

1. **监听 source 变化**：
   ```ts
   watch(() => props.source, () => {
     vector_source.value?.clear();
     if (layer.value) map.removeLayer(layer.value);
     init();
   });
   ```

2. **重新创建 VectorSource**：
   ```ts
   vector_source.value = new VectorSource({ ...props.source });
   ```

3. **重建 Heatmap 图层**：
   ```ts
   layer.value = new Heatmap({
     ...props,
     source: vector_source.value,
   });
   ```

4. **重新添加图层并绑定事件**：确保事件监听和图层 ID 一致性。

此机制确保了数据更新后热力图能立即反映最新状态。

**Section sources**
- [index.vue](file://src/packages/layers/heatmap/index.vue#L78-L108)

## rendercomplete事件与性能监控

### 事件触发条件

`OlHeatmap` 组件通过 `sourceready` 事件通知图层准备就绪：

```ts
layer.value.on("sourceready", () => {
  layerReady.value = true;
  emit("sourceready", layer.value);
});
```

- **触发时机**：热力图层及其数据源完成初始化并可渲染时。
- **用途**：可用于在热力图加载完成后显示内容（如 `<slot>`）或执行后续逻辑。

### 性能监控意义

- **加载时间监控**：通过监听 `sourceready` 时间戳，可评估大数据量下的渲染性能。
- **用户体验优化**：在事件触发前显示加载状态，避免界面卡顿感。
- **错误排查**：若事件未触发，可检查数据源格式或网络请求是否正常。

**Section sources**
- [index.vue](file://src/packages/layers/heatmap/index.vue#L106-L108)

## 典型应用场景示例

### 用户密度热力图

```vue
<ol-heatmap 
  :weight="'userCount'" 
  :radius="10" 
  :blur="8"
  :gradient="['#00f', '#0ff', '#0f0']"
>
  <ol-feature :geo-json="userDensityData" />
</ol-heatmap>
```

### 事件频次热力图

```ts
// 动态归一化权重
const setWeight = (feature: any) => {
  const value = feature.get("eventCount");
  return value / maxEventCount;
};
```

### 多层级自适应热力图

在 `examples/heatmap/index.vue` 中，通过监听 `@changeZoom` 事件动态调整 `radius`，实现不同缩放级别下视觉一致性：

```ts
const handleZoom = (event: any) => {
  const { zoom } = event;
  radius.value = 3 + (zoom - 11) * Math.pow(1.5, zoom - 11);
};
```

**Section sources**
- [examples/heatmap/index.vue](file://src/examples/heatmap/index.vue#L0-L97)

## Canvas与WebGL渲染模式对比

| 特性 | Canvas 模式 | WebGL 模式 |
|------|------------|-----------|
| **渲染性能** | 中等，适合 < 10万 点 | 高，适合 > 10万 点 |
| **视觉质量** | 支持模糊、渐变 | 更高精度，支持复杂着色 |
| **内存占用** | 较低 | 较高 |
| **兼容性** | 极佳 | 需支持 WebGL 的浏览器 |
| **实现方式** | `ol/layer/Heatmap` | 需自定义 WebGL 渲染器 |

当前 `OlHeatmap` 基于 OpenLayers 的 `Heatmap` 类，使用 Canvas 渲染。如需 WebGL 性能，可考虑使用 `WebGLVectorLayer` 扩展。

**Section sources**
- [index.vue](file://src/packages/layers/heatmap/index.vue#L0-L150)
- [baseLayer/index.ts](file://src/packages/layers/baseLayer/index.ts#L0-L126)

## 大数据量优化建议

1. **数据聚合**：在服务端或前端对密集点进行聚合，减少渲染点数。
2. **动态权重归一化**：避免个别高权重点主导整体颜色分布。
3. **按需加载**：结合地图视图范围，仅加载可视区域内的数据。
4. **合理配置 radius 和 blur**：避免过大的值导致性能下降。
5. **使用 Web Worker**：在后台线程处理数据解析与归一化，避免阻塞主线程。
6. **考虑 WebGL 方案**：对于超大数据量（>50万点），评估迁移到 WebGL 渲染的可行性。