# v3-ol-map

> vue3 OpenLayers组件
> 
> [![vue3](https://img.shields.io/badge/vue-v3.4.27-8A2BE2)](https://github.com/vuejs/core/tree/main/packages/vue#readme)
> [![ol](https://img.shields.io/badge/OpenLayers-v10-20c3aa)](https://openlayers.org/)

功能上基本和vue2版本的[v-ol-map](https://github.com/pp129/vue-openlayers-map)一致。

- 地图 ol-mao
- 配置项 ol-config
- 鹰眼 ol-overview
- 图层
    - 矢量图层 ol-vector
      - WFS图层 ol-wfs
    - 瓦片图层 ol-tile
    - 图像图层 ol-image
      - WMS图层 ol-wms
    - TIFF图层 ol-tiff
    - 热力图 ol-heatmap
    - 聚合图层 ol-cluster
    - ~~图形图层~~
- 图层要素 ol-feature
- 弹框 ol-overlay
- 路径规划 ol-route
- 结合echarts ol-echarts (基于[ol-echarts](https://github.com/sakitam-fdd/ol3Echarts)实现)
- 轨迹动画 ol-path
- 绘制 ol-draw
- 测量 ol-measure
- 兴趣点/面 ol-pin

__相较于v-ol-map,暂不支持的设置或功能:__

* `tile`组件`tile-type`移除部分类型，[具体支持类型查看(文档待补充...)](#v3-ol-map)。
* 图形图层组件

## 安装

npm安装

```bash
npm install v3-ol-map
```

pnpm安装

```bash
pnpm install v3-ol-map
```

## 使用

```vue
<script setup>
import { OlMap, OlTile } from "v-3-ol-map";
</script>

<template>
  <div>
    <ol-map>
      <ol-tile tile-type="TDT" />
    </ol-map>
  </div>
</template>
```

## 组件

一点设计思路：__尽量使用`ol`原生api，通过`props`传递参数。__ 例如：

把`ol/Map`的属性直接作为`ol-map`组件的属性，把`ol/Map`的方法作为`ol-map`组件的方法。

但是！又例如`Map`的`view`属性值其实是一个独立的类，通过原生代码实现是这样的:

```vue
<script setup lang="ts">
import { Map } from "ol";
import { View } from "ol/View";

const view = new View({
  center: [0, 0],
  zoom: 2,
});

const map = new Map({
  target: "map",
  view: view,
});
</script>

<template>
  <div id="map"></div>
</template>
```

我们希望可以直接解构View，直接把View类的`Options`，直接当成`ol-map`的参数值，这样代码看起来会简洁很多，所以组件中实现如下：

```vue
<script setup lang="ts">
import { OlMap, VMap } from "v-3-ol-map";

const view:VMap["view"] = {
  center: [0, 0],
  zoom: 2,
}

<template>
   <ol-map :view="view" />
</template>
```

可以理解成组件做了这样的操作：

* 组件接收参数：`props: { Y: as PropType<import("ol/X/Y").Options> }`
* 重组类`new X({Y:new Y(props.Y)})`
* 使用：`const options = {y: ... }` `<ol-x :y="options.y" />`

其他类似的设计在各组件中都有体现，如`ol-vector`、`ol-tile`组件的`source`属性，甚至会对`source`属性进行二次解构，例如将`source.tileGrid`的`Options`作为`source.tileGrid`的属性值传递。

```vue
<script setup lang="ts">
import { OlMap, VMap, OlTile } from "v-3-ol-map";

const source = {
  tileGrid: {
    origin: [0, 0],
  }
}
</script>

<template>
  <ol-map>
    <ol-tile :source="source" />
  </ol-map>
</template>
```

### 可能的问题

需要解构的类很多，组件还没有完全实现，所以在使用中遇到没生效的参数可能就是组件内部没有解构并重组参数造成的。

可能发生了以下问题：

* 组件接收参数：`props: { Y as PropType<import("ol/X/Y").Options extends Z= import("ol/X/Y/Z").Options> }`
* 问题：类`ol/X/Y`中包含属性`Z`的值接受的是一个类，`new X({Y:new Y({...props.Y,Z:new Z(props.Y.Z)})})`，但是组件没有解构并重组参数，所以`props.Y.Z`没有生效。
