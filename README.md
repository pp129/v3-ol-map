# v3-ol-map

[![vue3](https://img.shields.io/badge/vue-v3.4.27-8A2BE2)](https://github.com/vuejs/core/tree/main/packages/vue#readme) [![ol](https://img.shields.io/badge/OpenLayers-v10-20c3aa)](https://openlayers.org/)

> vue3 OpenLayers组件

vue2版本：[v-ol-map](https://github.com/pp129/vue-openlayers-map)

## 文档与示例

[文档地址](https://v3-ol-map.netlify.app/)

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

### 完整引入

```ts
// main.ts
import { createApp } from 'vue'
import VOlMap from "v3-ol-map";
import App from './App.vue'

const app = createApp(App)

app.use(VOlMap)
app.mount('#app')
```

### 按需引入

```html
<script setup>
import { OlMap, OlTile } from "v3-ol-map";
</script>

<template>
  <div>
    <ol-map>
      <ol-tile tile-type="TDT" />
    </ol-map>
  </div>
</template>
```

## 说明

一点设计思路：__尽量使用`ol`原生api，通过`props`传递参数。__ 例如：

把`ol/Map`的属性直接作为`ol-map`组件的属性，把`ol/Map`的方法作为`ol-map`组件的方法。

> 但是！`view`属性值其实是一个独立的类，通过原生代码实现是这样的:

```html
<script setup lang="ts">
import { Map } from "ol";
import { View } from "ol/View";

const view = new View({
  center: [0, 0],
  zoom: 2,
});

const map = new Map({
  target: "map",
  view: view, // 注意这里view其实是一个类
});
</script>

<template>
  <div id="map"></div>
</template>
```

我们希望可以直接解构View，直接把View类的`Options`，直接当成`ol-map`的参数值，这样代码看起来会简洁很多，所以组件中实现如下：

```html
<script setup lang="ts">
import { OlMap, VMap } from "v-3-ol-map";

// 抽出ol.View的Options
const view:VMap["view"] = {
  center: [0, 0],
  zoom: 2,
}
</script>

<template>
   <ol-map :view="view" />
</template>
```

类似的设计在各组件中都有体现，如`ol-vector`、`ol-tile`组件的`source`属性，甚至会对`source`属性进行二次解构，例如将`source.tileGrid`的`Options`作为`source.tileGrid`的属性值传递。

```html
<script setup lang="ts">
import { OlMap, VMap, OlTile } from "v-3-ol-map";

// 一次解构：抽出ol/source/Tile的Options
const source = {
  // 二次解构：抽出ol/tilegrid/TileGrid的Options
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
