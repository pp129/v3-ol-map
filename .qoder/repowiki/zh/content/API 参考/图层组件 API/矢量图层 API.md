# 矢量图层 API

<cite>
**本文档引用文件**  
- [index.vue](file://src/packages/layers/vector/index.vue#L1-L105)
- [vector.ts](file://src/packages/hooks/vector.ts#L1-L302)
- [Vector.ts](file://src/packages/types/Vector.ts#L1-L48)
- [style.ts](file://src/packages/utils/style.ts#L1-L135)
- [index.vue](file://src/examples/vector/index.vue#L1-L300)
</cite>

## 目录
1. [简介](#简介)
2. [核心配置项详解](#核心配置项详解)
3. [矢量数据加载与格式支持](#矢量数据加载与格式支持)
4. [事件系统与语义说明](#事件系统与语义说明)
5. [插槽与自定义渲染](#插槽与自定义渲染)
6. [样式系统与动态绑定](#样式系统与动态绑定)
7. [性能优化与高级用法](#性能优化与高级用法)
8. [完整示例解析](#完整示例解析)

## 简介
`OlVector` 是基于 OpenLayers 的 `VectorLayer` 与 `VectorSource` 封装的矢量图层组件，用于在地图上展示点、线、面等地理要素。该组件支持 GeoJSON、TopoJSON、EsriJSON 等多种数据格式加载，提供灵活的样式控制、交互操作（如修改、平移）以及丰富的事件系统。通过 `feature` 插槽可实现要素的自定义渲染，并支持大数据量下的性能优化策略。

**Section sources**
- [index.vue](file://src/packages/layers/vector/index.vue#L1-L105)

## 核心配置项详解

### features
**类型**: `GeoJSONFeature[] | FeatureGeometry[]`  
**说明**: 用于直接传入要素数据。可通过 `ol-feature` 组件的 `geo-json` 或 `geometries` 属性传入。当使用 `source` 配置项时，此属性可省略。

### sourceOptions
**类型**: `VectorSourceOptions`  
**说明**: 定义矢量数据源的配置，支持从 URL 加载远程数据或本地数据初始化。关键字段包括：
- `url`: 数据源地址
- `featureFormat`: 数据格式（支持 `"GeoJSON"`, `"TopoJSON"`, `"EsriJSON"`）
- `formatOptions`: 格式化选项，如 `dataProjection`（数据投影）和 `featureProjection`（要素投影）

```ts
interface VectorSourceOptions extends SourceOptions {
  featureFormat?: keyof typeof Format;
  formatOptions?: FormatOptions;
  wfsOptions?: WriteGetFeatureOptions;
}
```

### style
**类型**: `LayerOptions["style"] | DefaultStyle | WebGLStyle`  
**说明**: 图层级别的样式配置。支持 OpenLayers 的扁平化样式（Flat Style）对象或函数。若未设置，将使用默认蓝色填充样式。可通过数组形式定义多规则样式，结合 `filter` 实现条件渲染。

### renderMode
**说明**: 虽未在 props 中显式定义，但通过 `layerStyle` 类型可间接控制渲染模式。若使用 `WebGLStyle`，则底层使用 `WebGLVectorLayer` 提升渲染性能；否则使用标准 `VectorLayer`。

### layerId
**类型**: `string`  
**说明**: 图层唯一标识符，用于事件过滤和图层管理。

### visible
**类型**: `boolean`  
**说明**: 控制图层是否可见，默认为 `true`。

### modify
**类型**: `boolean`  
**说明**: 启用/禁用要素修改交互。启用后，用户可通过拖拽调整要素形状。

### translate
**类型**: `boolean`  
**说明**: 启用/禁用要素平移交互。启用后，用户可选中并拖动要素。

**Section sources**
- [Vector.ts](file://src/packages/types/Vector.ts#L1-L48)
- [vector.ts](file://src/packages/hooks/vector.ts#L1-L302)

## 矢量数据加载与格式支持

### 支持的数据格式
`OlVector` 支持以下格式的矢量数据加载：
- **GeoJSON**: 最常用的地理数据交换格式
- **TopoJSON**: 基于 GeoJSON 的拓扑数据格式，文件更小
- **EsriJSON**: ArcGIS 使用的专有格式

### 加载方式
1. **静态数据**: 通过 `ol-feature` 组件直接传入 `geo-json` 或 `geometries`
2. **远程数据**: 在 `source` 中配置 `url` 和 `featureFormat`

```ts
const sourceOptions = {
  url: "/data/roads.json",
  featureFormat: "GeoJSON",
  formatOptions: {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857"
  }
};
```

### 动态更新数据源
当 `props.source` 发生变化时，组件会自动清除旧数据源并重新初始化：

```ts
watch(
  () => props.source,
  () => {
    layer.value?.getSource()?.clear();
    if (layer.value) map.removeLayer(layer.value);
    init();
  },
);
```

**Section sources**
- [vector.ts](file://src/packages/hooks/vector.ts#L1-L302)

## 事件系统与语义说明

### featureclick
**事件名**: `singleclick`  
**触发条件**: 用户单击地图时触发  
**事件对象结构**:
```ts
{
  pixel: [x, y],        // 屏幕坐标
  coordinate: [lon, lat], // 地理坐标
  feature: Feature       // 被点击的要素（若存在）
}
```

### featureselect
**说明**: 本组件未直接提供 `featureselect` 事件，但可通过 `singleclick` 事件结合 `getFeatureAtPixel` 实现选择逻辑：

```ts
const getFeatureAtPixel = (pixel: Pixel) => {
  return map.forEachFeatureAtPixel(
    pixel,
    feature => feature,
    {
      layerFilter: (vector_layer: Layer) => {
        return vector_layer.get("id") === layer.value?.get("id");
      }
    }
  );
};
```

### 其他重要事件
| 事件名 | 触发时机 | 事件对象附加信息 |
|-------|--------|----------------|
| `sourceready` | 数据源准备就绪 | 无 |
| `featuresloadstart` | 要素开始加载 | 无 |
| `featuresloadend` | 要素加载完成 | 无 |
| `addfeature` | 新要素添加 | `feature` 对象 |
| `changefeature` | 要素属性或几何变化 | `feature` 对象 |
| `modifyend` | 修改操作结束 | 包含 `metersPerUnit` 的事件对象 |
| `translateend` | 平移操作结束 | 包含 `metersPerUnit` 的事件对象 |

**Section sources**
- [vector.ts](file://src/packages/hooks/vector.ts#L1-L302)

## 插槽与自定义渲染

### feature 插槽
`OlVector` 支持 `<slot>` 插槽，允许嵌套 `ol-feature` 组件实现自定义要素渲染：

```vue
<ol-vector>
  <ol-feature :geo-json="geojson" />
  <ol-feature :geometries="geometryData" />
</ol-vector>
```

### 渲染流程
1. 组件初始化后设置 `layerReady = true`
2. 触发 `<slot>` 渲染
3. 子组件 `ol-feature` 通过注入的 `ParentLayer` 获取父图层引用
4. 将要素添加到图层的数据源中

```vue
<template>
  <slot v-if="layerReady"></slot>
</template>
```

**Section sources**
- [index.vue](file://src/packages/layers/vector/index.vue#L1-L105)

## 样式系统与动态绑定

### layerStyle 与 featureStyle 区别
- **layerStyle**: 应用于整个图层的样式，支持条件渲染规则数组
- **featureStyle**: 应用于单个要素的样式，优先级高于 `layerStyle`

### 动态样式计算
通过 `setFeatureStyle` 工具函数实现动态样式绑定：

```ts
export const setFeatureStyle = (feature: Feature, style: FeatureStyle, map: Map) => {
  const featureStyle = setStyle(style);
  feature.setStyle(featureStyle);
  if (validObjKey(style, "styleFunction")) {
    feature.setStyle(function (feature, resolution) {
      return style.styleFunction && style.styleFunction(feature, resolution, map, featureStyle);
    });
  }
};
```

### 条件样式示例
```ts
const layerStyle = [
  {
    filter: ["==", ["get", "name"], "Point2"],
    style: { "icon-src": cluster2 }
  },
  {
    else: true,
    style: { "icon-src": icon }
  }
];
```

**Section sources**
- [style.ts](file://src/packages/utils/style.ts#L1-L135)
- [index.vue](file://src/packages/layers/vector/index.vue#L1-L105)

## 性能优化与高级用法

### 大数据量渲染
对于大数据量场景，建议：
1. 使用 `WebGLVectorLayer` 替代标准 `VectorLayer`
2. 配置 `renderMode` 为 `webgl`
3. 采用矢量切片（`ol-vector-tile`）而非普通矢量图层

### 要素聚合
虽然 `OlVector` 本身不直接支持聚合，但可通过外部 `Cluster` 源实现：

```ts
import Cluster from 'ol/source/Cluster';
const clusterSource = new Cluster({ source: vectorSource });
```

### 动态样式计算
利用 `styleFunction` 实现基于要素属性和地图分辨率的动态样式：

```ts
featureStyle: {
  styleFunction: (feature, resolution, map, originalStyle) => {
    const size = feature.get('count');
    const radius = Math.max(8, size * 0.5);
    return new Style({
      image: new Circle({ radius, fill: new Fill({ color: 'red' }) })
    });
  }
}
```

### 内存管理
组件在卸载时自动清理资源：
```ts
onBeforeUnmount(() => {
  dispose();
});
```
`dispose` 函数会移除所有事件监听器，防止内存泄漏。

**Section sources**
- [vector.ts](file://src/packages/hooks/vector.ts#L1-L302)

## 完整示例解析

### 示例代码分析
```vue
<ol-vector
  ref="vectorRef"
  :layer-style="layerStyle"
  :z-index="1"
  @singleclick="onClickLayer"
  @sourceready="onSourceReady"
>
  <ol-feature :geo-json="geojson" />
</ol-vector>
```

### 关键配置说明
- `layerStyle`: 定义了基于 `name` 属性的多规则样式
- `@singleclick`: 点击事件处理函数，用于显示要素信息
- `@sourceready`: 数据源就绪后显示提示信息
- `ref="vectorRef"`: 获取组件实例，调用 `getFeatureById` 等方法

### 交互功能演示
第二个 `ol-vector` 启用了 `translate` 平移功能，用户可直接拖动要素：

```vue
<ol-vector :translate="true" @translateend="translateend">
```

**Section sources**
- [index.vue](file://src/examples/vector/index.vue#L1-L300)