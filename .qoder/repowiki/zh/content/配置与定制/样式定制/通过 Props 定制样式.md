# 通过 Props 定制样式

<cite>
**本文档引用文件**  
- [Style.ts](file://src/packages/types/Style.ts#L0-L47)
- [style.ts](file://src/packages/utils/style.ts#L0-L135)
- [index.vue](file://src/packages/interaction/pin/index.vue#L81-L89)
- [index.vue](file://src/packages/layers/cluster/index.vue#L162-L196)
- [measure.ts](file://src/packages/interaction/measure/measure.ts#L13-L66)
</cite>

## 目录
1. [简介](#简介)
2. [样式配置类型详解](#样式配置类型详解)
3. [核心样式属性结构与用法](#核心样式属性结构与用法)
4. [在组件中传递样式对象](#在组件中传递样式对象)
5. [常见样式配置示例](#常见样式配置示例)
6. [动态样式与样式函数](#动态样式与样式函数)
7. [性能优化建议](#性能优化建议)

## 简介
本文档详细说明如何通过组件的 `props` 传递样式对象来自定义地图元素的外观。结合 `types/Style.ts` 中定义的 `Style` 配置类型，深入解析支持的样式属性如 `fill`、`stroke`、`text`、`icon` 等的结构与使用方法。以 `OlVector` 和 `OlFeature` 组件为例，展示如何在模板中通过 `:style` 传入样式对象，实现点、线、面要素的个性化渲染。同时提供多种常见样式配置的代码示例，并说明样式更新机制与性能优化建议。

**Section sources**
- [Style.ts](file://src/packages/types/Style.ts#L0-L47)
- [style.ts](file://src/packages/utils/style.ts#L0-L135)

## 样式配置类型详解
在项目中，所有样式配置均基于 `types/Style.ts` 文件中定义的 `FeatureStyle` 接口。该接口整合了 OpenLayers 样式系统的多个核心选项，支持对地图要素进行全方位的视觉定制。

```typescript
export interface FeatureStyle extends FeatureStyleOptions {
  styleFunction?: (feature: FeatureLike, resolution: number, map: Map, style: Style) => Style | Array<Style> | void;
}
```

其中 `FeatureStyleOptions` 继承自 `StyleOptions`，包含以下主要属性：
- `fill`: 填充样式（用于多边形）
- `stroke`: 描边样式（用于线和面边界）
- `icon`: 图标样式（用于点要素）
- `image`: 图像样式（可为圆形或规则形状）
- `text`: 文本样式
- `circle`: 圆形样式配置
- `shape`: 规则形状样式
- `styleFunction`: 动态样式函数

**Section sources**
- [Style.ts](file://src/packages/types/Style.ts#L0-L47)

## 核心样式属性结构与用法

### 填充与描边样式
`fill` 和 `stroke` 是最基础的样式属性，分别控制要素的填充颜色和边框样式。

```ts
const fillStyle = {
  color: "rgba(255, 0, 0, 0.5)" // 红色半透明填充
};

const strokeStyle = {
  color: "#000000",
  width: 2,
  lineDash: [10, 5] // 虚线效果
};
```

这些选项直接对应 OpenLayers 的 `FillOptions` 和 `StrokeOptions` 类型。

### 图标样式
`icon` 属性用于设置点要素的图标标记，支持多种配置项：

```ts
const iconStyle = {
  src: "data:image/png;base64,...", // Base64 编码图像
  anchor: [0.5, 46], // 锚点位置
  anchorXUnits: "fraction",
  anchorYUnits: "pixels",
  scale: 1.2 // 缩放比例
};
```

如 `pin/index.vue` 中所示，可通过 `new Icon()` 创建图标样式对象。

**Section sources**
- [index.vue](file://src/packages/interaction/pin/index.vue#L81-L89)

### 文本样式
`text` 属性允许为要素添加标签文本，其结构定义在 `TextStyleOptions` 接口中：

```ts
export interface TextStyleOptions extends defaultTextStyleOptions {
  fill?: FillOptions;
  backgroundFill?: FillOptions;
  stroke?: StrokeOptions;
  backgroundStroke?: StrokeOptions;
  text?: string;
}
```

默认字体为 `"14px sans-serif"`，可通过 `padding` 设置文本内边距。

### 圆形与规则形状
`circle` 和 `shape` 属性用于创建几何图形样式的点标记：

```ts
const circleStyle = {
  radius: 5,
  fill: { color: "blue" },
  stroke: { color: "white", width: 2 }
};
```

## 在组件中传递样式对象
在 Vue 模板中，可通过 `:style` 绑定将样式对象传递给 `OlVector` 或 `OlFeature` 组件：

```vue
<ol-vector :style="vectorStyle">
  <ol-feature :style="pointStyle" />
</ol-vector>
```

底层通过 `utils/style.ts` 中的 `setStyle` 函数将配置对象转换为 OpenLayers 的 `Style` 实例：

```ts
export const setStyle = (option: FeatureStyle) => {
  const style = new Style();
  if (validObjKey(option, "fill")) {
    style.setFill(new Fill(option.fill));
  }
  if (validObjKey(option, "stroke")) {
    style.setStroke(new Stroke(option.stroke));
  }
  // ...其他属性处理
  return style;
};
```

当存在 `styleFunction` 时，会动态生成样式，适用于根据要素属性差异化渲染的场景。

**Section sources**
- [style.ts](file://src/packages/utils/style.ts#L60-L122)
- [components.ts](file://src/packages/components.ts#L30-L95)

## 常见样式配置示例

### 自定义图标标记
```ts
const iconStyle = {
  icon: {
    src: "/assets/marker.png",
    anchor: [0.5, 1],
    scale: 0.8
  }
};
```

### 渐变填充（需配合 Canvas 实现）
虽然 OpenLayers 原生不直接支持 CSS 渐变，但可通过自定义渲染函数实现复杂填充效果。

### 动态文本标签
```ts
const textStyle = {
  text: {
    font: "bold 16px sans-serif",
    text: "北京市",
    fill: { color: "white" },
    stroke: { color: "black", width: 3 },
    offsetX: 15,
    offsetY: -15
  }
};
```

### 聚类图层样式
在 `cluster/index.vue` 中，根据要素数量动态设置样式：

```ts
const styleOptions = {
  image: new Circle({
    radius: size,
    fill: new Fill({ color: "#3399CC" })
  }),
  text: new Text({
    text: size.toString(),
    fill: new Fill({ color: "#fff" })
  })
};
```

**Section sources**
- [index.vue](file://src/packages/layers/cluster/index.vue#L162-L196)
- [measure.ts](file://src/packages/interaction/measure/measure.ts#L13-L66)

## 动态样式与样式函数
对于需要根据要素属性动态变化的样式，可使用 `styleFunction`：

```ts
const dynamicStyle = {
  styleFunction: (feature, resolution) => {
    const value = feature.get("population");
    const color = value > 1000000 ? "red" : "blue";
    return new Style({
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "black" })
    });
  }
};
```

此函数在每次重绘时调用，接收要素、分辨率等参数，返回相应的 `Style` 对象。

**Section sources**
- [style.ts](file://src/packages/utils/style.ts#L124-L134)
- [Style.ts](file://src/packages/types/Style.ts#L45-L47)

## 性能优化建议
1. **避免频繁创建样式对象**：尽量复用已创建的 `Style` 实例，而非在每次渲染时重新创建。
2. **合理使用样式函数**：`styleFunction` 会在每一帧调用，应确保其执行效率，避免复杂计算。
3. **简化样式结构**：不必要的样式属性会增加渲染开销，只保留必需的配置。
4. **批量更新**：当需要更新多个要素样式时，考虑使用事务性操作减少重绘次数。
5. **利用缓存机制**：对基于属性的动态样式，可加入简单缓存避免重复计算相同值。

通过合理运用上述样式配置机制，可以实现高度个性化的地图可视化效果，同时保持良好的运行性能。

**Section sources**
- [style.ts](file://src/packages/utils/style.ts#L0-L135)
- [Style.ts](file://src/packages/types/Style.ts#L0-L47)