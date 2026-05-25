# 风场图层 API

<cite>
**本文档引用文件**  
- [index.vue](file://src/examples/wind/index.vue#L0-L142)
- [index.ts](file://src/packages/layers/wind/index.ts#L0-L6)
- [index.vue](file://src/packages/layers/wind/index.vue#L0-L212)
- [Wind.ts](file://src/packages/types/Wind.ts#L0-L49)
</cite>

## 目录
1. [简介](#简介)
2. [核心配置项详解](#核心配置项详解)
3. [风场数据格式要求](#风场数据格式要求)
4. [粒子动画渲染机制与性能控制](#粒子动画渲染机制与性能控制)
5. [应用场景与配置示例](#应用场景与配置示例)
6. [动态时间序列播放实现](#动态时间序列播放实现)
7. [性能调优建议](#性能调优建议)
8. [附录：类型定义参考](#附录类型定义参考)

## 简介
`OlWind` 是一个基于 OpenLayers 的风场可视化组件，用于在地图上渲染动态风场效果。该组件利用 WebGL 技术实现高性能粒子动画，支持气象数据、海洋流场等复杂场景的实时可视化。通过灵活的配置项，开发者可以精确控制风速映射、颜色梯度、粒子密度等视觉参数，并结合事件监听实现交互式信息展示。

本 API 文档详细说明了 `OlWind` 组件的核心配置项、数据格式、渲染机制及性能优化策略，帮助开发者高效集成风场图层功能。

**Section sources**
- [index.vue](file://src/examples/wind/index.vue#L0-L142)

## 核心配置项详解

### windOptions 配置项
`windOptions` 是风场渲染的核心配置对象，控制粒子动画的视觉表现和物理行为。

**配置项说明：**

- **velocityScale**: 速度缩放因子，用于调整风速对粒子移动的影响程度。  
  - 取值范围：正浮点数  
  - 示例值：`1 / 20` 表示将原始风速缩小 20 倍进行渲染  
  - 作用：数值越小，粒子运动越缓慢；数值越大，运动越快

- **paths**: 粒子路径数量，决定画布上同时存在的粒子总数。  
  - 取值范围：正整数  
  - 示例值：`5000`  
  - 影响：直接影响视觉密度和 GPU 负载，过高可能导致性能下降

- **colorScale**: 颜色渐变数组，按风速大小映射粒子颜色。  
  - 类型：RGB 颜色字符串数组  
  - 示例值：
    ```ts
    [
      "rgb(36,104, 180)",
      "rgb(60,157, 194)",
      ...
      "rgb(180,0,35)"
    ]
    ```
  - 映射规则：数组长度决定风速分级数，低风速使用前段颜色，高风速使用后段颜色

- **lineWidth**: 粒子轨迹线宽。  
  - 取值范围：正数  
  - 默认值：`1`  
  - 视觉影响：线宽越大，轨迹越明显，但可能影响流畅度

### fieldOptions 配置项
`fieldOptions` 控制风场数据的处理方式。

- **wrapX**: 是否在 X 方向（经度）循环贴图。  
  - 类型：布尔值  
  - 默认值：`true`  
  - 应用场景：适用于全球范围风场，确保东西边界无缝衔接

- **flipY**: 是否翻转 Y 轴方向（纬度）。  
  - 类型：布尔值  
  - 默认值：`false`  
  - 注意：某些数据源可能需要开启此选项以匹配坐标系

**Section sources**
- [index.vue](file://src/examples/wind/index.vue#L10-L25)
- [index.vue](file://src/packages/layers/wind/index.vue#L50-L100)

## 风场数据格式要求

### 数据结构
风场数据需为二维网格形式，每个网格点包含 U/V 风速分量：

```json
{
  "header": {
    "nx": 360,       // 经度方向网格数
    "ny": 180,       // 纬度方向网格数
    "lo1": 0,        // 起始经度
    "la1": 90,       // 起始纬度
    "dx": 1,         // 经度步长
    "dy": 1          // 纬度步长
  },
  "data": [         // U/V 分量交错排列
    u0, v0,
    u1, v1,
    ...
  ]
}
```

### U/V 分量定义
- **U 分量**：东西方向风速（东为正）
- **V 分量**：南北方向风速（北为正）
- 单位：米/秒（m/s）

### 坐标系统
- 支持 WGS84 经纬度坐标系（EPSG:4326）
- 网格数据需按行优先顺序排列（从左到右，从上到下）
- 组件内部自动进行坐标插值与投影变换

**Section sources**
- [index.vue](file://src/examples/wind/index.vue#L40-L45)
- [index.vue](file://src/packages/layers/wind/index.vue#L120-L130)

## 粒子动画渲染机制与性能控制

### 渲染机制
`OlWind` 使用 `ol-wind` 库基于 WebGL 实现粒子系统：
1. 将风场数据解析为矢量场（`Field` 对象）
2. 创建大量粒子（`paths` 数量），每个粒子记录当前位置和速度
3. 每帧根据所在位置的风速更新粒子坐标
4. 使用纹理线段绘制粒子运动轨迹
5. 应用颜色映射（`colorScale`）着色

### 性能控制参数

- **fadeOpacity**: 轨迹衰减透明度（未显式配置，默认由 `wind-core` 控制）  
  - 作用：控制旧轨迹的淡出速度  
  - 值越小，轨迹消失越快，画面更清晰但连续性减弱

- **speedFactor**: 粒子运动速度因子（通过 `velocityScale` 间接控制）  
  - 实际速度 = 风速 × velocityScale × speedFactor  
  - 可通过动态修改 `velocityScale` 实现变速播放

- **forceRender**: 强制渲染开关  
  - 类型：布尔值  
  - 默认值：`true`  
  - 作用：防止 OpenLayers 在缩放/拖拽时隐藏图层，保证交互流畅性

**Section sources**
- [index.vue](file://src/packages/layers/wind/index.vue#L50-L150)

## 应用场景与配置示例

### 气象数据可视化
```vue
<ol-wind
  :data="weatherData"
  :wind-options="{
    velocityScale: 1 / 15,
    paths: 8000,
    colorScale: [
      'rgb(0, 102, 255)',   // 蓝色系表示低风速
      'rgb(255, 255, 0)',
      'rgb(255, 0, 0)'     // 红色系表示高风速
    ],
    lineWidth: 1.5
  }"
  :field-options="{ wrapX: true }"
/>
```

### 海洋流场模拟
```vue
<ol-wind
  :data="oceanCurrent"
  :wind-options="{
    velocityScale: 1 / 50,    // 海流速度较慢，需更大缩放
    paths: 3000,              // 降低密度避免视觉混乱
    colorScale: [
      'rgb(0, 128, 255)',
      'rgb(0, 255, 255)',
      'rgb(0, 255, 128)'
    ]
  }"
/>
```

### 交互式信息展示
通过 `@pointermove` 事件获取鼠标位置的风速信息：

```ts
const handleMove = (e: WindLayerEvent) => {
  const data = e.data;
  if (data) {
    console.log(`风速: ${data.m} m/s`);
    console.log(`风向: ${data.windDirection}`);
    console.log(`风级: ${data.windLevel}`);
  }
};
```

**Section sources**
- [index.vue](file://src/examples/wind/index.vue#L30-L80)

## 动态时间序列播放实现

### 数据更新机制
通过 `watch` 监听 `props.data` 变化，自动调用 `setData()` 更新风场：

```ts
watch(
  () => props.data,
  newVal => {
    layer.value?.setData(newVal);
  },
  { deep: true }
);
```

### 时间序列播放步骤
1. 准备多个时间点的风场数据（如每小时一次）
2. 使用定时器或动画循环逐帧切换数据
3. 示例代码：

```ts
const timeSeriesData = [/* 多个时间点的数据 */];
let currentIndex = 0;

setInterval(() => {
  data.value = timeSeriesData[currentIndex];
  currentIndex = (currentIndex + 1) % timeSeriesData.length;
}, 1000); // 每秒切换一帧
```

### 速度调节
通过动态调整 `velocityScale` 实现快放/慢放：

```ts
// 加速播放
windOptions.velocityScale *= 1.5;

// 减速播放
windOptions.velocityScale /= 1.5;
```

**Section sources**
- [index.vue](file://src/packages/layers/wind/index.vue#L160-L180)

## 性能调优建议

### WebGL 优化
- **启用 forceRender**: 避免地图交互时图层闪烁
- **合理设置 paths**: 根据设备性能调整粒子数量（移动端建议 ≤3000）
- **控制 colorScale 长度**: 过多颜色层级会增加着色器计算负担

### 粒子密度调节
| 场景 | 推荐 paths 数量 | velocityScale |
|------|------------------|---------------|
| 全球风场概览 | 3000~5000 | 1/20 ~ 1/30 |
| 区域高精度模拟 | 8000~12000 | 1/10 ~ 1/15 |
| 移动端展示 | 2000~4000 | 1/25 ~ 1/40 |

### 内存管理
- 组件自动处理 `onMounted` 和 `onUnmounted` 生命周期
- 使用 `defineExpose` 暴露 `getData()` 和 `getWindOptions()` 方法供外部调用
- 避免频繁创建销毁图层，推荐复用实例

### 帧率监控
建议在生产环境添加性能监控：
```ts
let frameCount = 0;
const startTime = Date.now();

// 每秒统计一次
setInterval(() => {
  const fps = frameCount / ((Date.now() - startTime) / 1000);
  console.log(`FPS: ${fps.toFixed(1)}`);
  frameCount = 0;
}, 1000);

// 在动画循环中计数
// frameCount++;
```

**Section sources**
- [index.vue](file://src/packages/layers/wind/index.vue#L180-L212)

## 附录：类型定义参考

### WindLayerOptions 接口
```ts
interface WindLayerOptions extends defaultVectorOptions {
  layerId?: string;
  data: any;
  forceRender?: boolean;
  windOptions?: WindOptions;
  fieldOptions?: FieldOptions;
}
```

### WindOptions 类型
```ts
type WindOptions = Partial<IOptions>;
// 包含 velocityScale, paths, colorScale, lineWidth 等
```

### WindData 结构
```ts
type WindData = {
  u: number;              // U 分量
  v: number;              // V 分量
  m: number;              // 风速（合速度）
  directionTo: number;    // 流向角度（0-360°）
  directionFrom: number;  // 风向角度（0-360°）
  windLevel: string;      // 风级（如"5级"）
  windDirection: string;  // 风向（如"西北风"）
} | null;
```

### 事件类型
- **mount**: 图层初始化完成时触发
- **singleclick**: 地图单击时返回点击位置风场数据
- **pointermove**: 鼠标移动时返回当前位置风场数据

**Section sources**
- [Wind.ts](file://src/packages/types/Wind.ts#L0-L49)