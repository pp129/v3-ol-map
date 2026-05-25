# 风场图层 (OlWind)

<cite>
**本文档引用的文件**  
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue)
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue)
- [src/packages/types/Wind.ts](file://src/packages/types/Wind.ts)
</cite>

## 目录
1. [项目结构](#项目结构)  
2. [核心组件](#核心组件)  
3. [风场数据解析与处理](#风场数据解析与处理)  
4. [粒子系统与动画机制](#粒子系统与动画机制)  
5. [用户交互与事件处理](#用户交互与事件处理)  
6. [性能优化建议](#性能优化建议)  
7. [应用场景配置](#应用场景配置)  

## 项目结构

风场图层功能主要分布在 `src/examples/wind/` 和 `src/packages/layers/wind/` 目录中。`examples` 目录提供使用示例，`packages` 目录包含核心实现。

```mermaid
graph TB
subgraph "示例"
Example[src/examples/wind/index.vue]
end
subgraph "核心实现"
Component[src/packages/layers/wind/index.vue]
Types[src/packages/types/Wind.ts]
end
Example --> Component : 使用
Component --> Types : 引用类型
```

**图示来源**  
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue)
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue)
- [src/packages/types/Wind.ts](file://src/packages/types/Wind.ts)

## 核心组件

风场图层（OlWind）基于 `ol-wind` 和 `wind-core` 库实现，封装为 Vue 组件，支持响应式数据绑定和地图集成。

### 组件定义与注入

`OlWind` 组件通过 `defineOptions` 定义名称，并依赖注入 `VMap` 实例获取 OpenLayers 地图对象。

```ts
defineOptions({
  name: "OlWind",
});

const VMap = inject("VMap") as OlMap;
const map: Map = unref(VMap).map;
```

组件接收 `WindLayerOptions` 类型的属性，包括风场数据、渲染选项和数据处理配置。

**组件属性结构：**
- **layerId**: 图层唯一标识
- **data**: 风场数据（NetCDF/GRIB 解析后）
- **forceRender**: 是否强制渲染（默认开启）
- **windOptions**: 渲染参数（速度缩放、路径数、颜色标尺等）
- **fieldOptions**: 数据场配置（如经度循环 wrapX）

```ts
const props = withDefaults(defineProps<WindLayerOptions>(), {
  forceRender: true,
});
```

**节来源**  
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue#L0-L25)

## 风场数据解析与处理

风场数据通常来自 NetCDF 或 GRIB 格式的气象数据文件，本实现通过 JSON 接口加载预处理数据。

### 数据加载示例

在 `index.vue` 示例中，通过 `fetch` 加载远程风场数据：

```ts
onBeforeMount(async () => {
  data.value = await fetch("https://blog.sakitam.com/wind-layer/data/wind.json")
    .then(res => res.json())
    .then(data => {
      load.value = true;
      return data;
    });
});
```

该数据结构符合 `wind-core` 的 `Field` 输入要求，通常包含网格化的 U/V 风速分量。

### 数据场插值算法

组件内部使用 `wind-core` 的 `Field` 类进行双线性插值，实现任意坐标点的风速向量查询。

```ts
const field: Field = layer.value?.field;
const vector = field.valueAt(evt.coordinate[0], evt.coordinate[1]);
```

`valueAt(x, y)` 方法基于周围四个网格点的风速向量进行插值，返回包含 `u`, `v`, `m`（风速大小）的 `Vector` 对象。

#### 风速等级与风向转换

组件内置函数将风速数值转换为风级（蒲福风级），并将向量角度转换为中文风向描述。

```ts
function gps_getWindyLevel(v: number) {
  if (v < 0.3) return 0;
  if (v >= 0.3 && v < 1.6) return 1;
  // ... 其他风级判断
  if (v >= 61.2) return 18;
}
```

```ts
function gps_getWindyDirection(angle: number) {
  if ((angle >= 0 && angle <= 22.5) || (angle <= 360 && angle > 337.5)) {
    return "北风";
  }
  if (angle <= 337.5 && angle > 292.5) {
    return "西北风";
  }
  // ... 其他风向判断
}
```

**节来源**  
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue#L26-L113)
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue#L0-L67)

## 粒子系统与动画机制

风场可视化采用粒子追踪算法，模拟空气微粒在速度场中的运动轨迹。

### 粒子系统初始化

组件在 `onMounted` 时调用 `init()` 方法创建 `WindLayer` 实例：

```ts
const init = () => {
  layer.value = new WindLayer(props.data, {
    windOptions: props.windOptions,
    forceRender: props.forceRender,
    fieldOptions: props.fieldOptions,
  });
  layer.value.setMap(map);
  emits("mount", layer.value);
};
```

`WindLayer` 来自 `ol-wind` 库，负责 WebGL 渲染和粒子动画。

### 动画参数配置

`windOptions` 控制粒子系统行为：

```ts
const windOptions: WindOptions = {
  velocityScale: 1 / 20,     // 速度缩放因子
  paths: 5000,               // 粒子路径数量
  colorScale: [              // 风速颜色映射表
    "rgb(36,104, 180)",
    "rgb(60,157, 194)",
    // ... 其他颜色
    "rgb(180,0,35)",
  ],
  lineWidth: 2,              // 轨迹线宽度
};
```

- **velocityScale**: 控制粒子运动速度，值越小运动越慢
- **paths**: 粒子数量，直接影响性能和视觉密度
- **colorScale**: 风速越大颜色越偏红（高温色）

### 帧率与时间步长

`ol-wind` 内部使用 `requestAnimationFrame` 实现 60 FPS 动画循环。每个帧根据 `velocityScale` 和速度场计算粒子位移，实现平滑流动效果。

粒子位置更新公式：
```
新位置 = 当前位置 + 速度向量 × 时间步长 × 速度缩放
```

**节来源**  
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue#L115-L119)
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue#L10-L24)

## 用户交互与事件处理

组件支持地图点击和悬停事件，实时显示当前位置的风速信息。

### 事件监听机制

```ts
map.on("pointermove", (evt: MapBrowserEvent<UIEvent>) => {
  const data = eventHandler(evt);
  emits("pointermove", <WindLayerEvent>{ ...evt, data });
});
```

`eventHandler` 函数查询当前鼠标坐标处的风速向量，并补充风级和风向信息。

### 信息展示实现

示例中使用 `ol-overlay` 在鼠标位置上方显示风速信息：

```vue
<ol-overlay :position="position">
  <div class="content">
    风速：{{ windowInfo.m }}
    <br />
    风级：{{ windowInfo.windLevel }}
    <br />
    风向：{{ windowInfo.windDirection }}
  </div>
</ol-overlay>
```

当鼠标移出地图时，`position` 设为 `undefined` 可隐藏信息框。

**节来源**  
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue#L141-L168)
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue#L69-L141)

## 性能优化建议

### 粒子数量控制

`paths` 参数直接影响 GPU 负载。建议根据设备性能动态调整：

- 移动端：`paths: 1000-2000`
- 桌面端：`paths: 3000-5000`

### 时间步长优化

适当降低 `velocityScale` 可减少粒子运动跨度，提高轨迹连续性，但过低会导致动画迟缓。建议范围：`1/30` 到 `1/10`。

### 数据更新策略

使用 `watch` 深度监听 `props.data` 和 `props.windOptions`，确保数据变化时图层及时更新：

```ts
watch(
  () => props.data,
  newVal => {
    layer.value?.setData(newVal);
  },
  { deep: true },
);
```

对于频繁更新场景，可添加防抖机制避免性能抖动。

### 强制渲染权衡

`forceRender: true` 可保证交互时图层不消失，但会增加渲染开销。若对流畅性要求高，可设为 `false`。

**节来源**  
- [src/packages/layers/wind/index.vue](file://src/packages/layers/wind/index.vue#L170-L211)

## 应用场景配置

### 气象预报

- 使用 GRIB2 格式数据，通过 `cfgrib` 或 `netCDF4` 库解析为 JSON 网格
- 配置多层风场（不同海拔）切换
- 结合等压线图层综合分析

### 环境模拟

- 设置 `wrapX: true` 支持全球循环风场
- 使用高精度 NetCDF 数据
- 结合污染物扩散模型

### 配置示例

```ts
const fieldOptions: FieldOptions = {
  wrapX: true,  // 支持经度360°循环
  // flipY: true // 若数据Y轴倒置则启用
};

const windOptions: WindOptions = {
  velocityScale: 1 / 15,
  paths: 3000,
  colorScale: ["#0066CC", "#0099FF", "#00FF00", "#FFFF00", "#FF6600", "#CC0000"],
  lineWidth: 1.5,
};
```

**节来源**  
- [src/examples/wind/index.vue](file://src/examples/wind/index.vue#L25-L47)
- [src/packages/types/Wind.ts](file://src/packages/types/Wind.ts#L32-L49)