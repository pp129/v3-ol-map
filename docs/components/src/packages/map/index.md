# map

## Props

| Prop name | Description | Type | Values | Default |
| --------- | ----------- | ---- | ------ | ------- |
| width     |             | -    | -      | "100%"  |
| height    |             | -    | -      | "100%"  |
| target    |             | -    | -      | ""      |

## Events

| Event name  | Properties                                                         | Description      |
| ----------- | ------------------------------------------------------------------ | ---------------- |
| load        |                                                                    | 地图加载完成事件 |
| changeZoom  | **evt** `ChangeZoomEvtTyp` - 事件对象<br/>**map** `Map` - 地图实例 | 地图视图改变事件 |
| singleclick |                                                                    |
| click       |                                                                    |
| dblclick    |                                                                    |
| pointerdrag |                                                                    |
| contextmenu |                                                                    |
| precompose  |                                                                    |
| postrender  |                                                                    |
| loadend     |                                                                    |
| loadstart   |                                                                    |
| moveend     |                                                                    |
| movestart   |                                                                    |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             |          |

## Expose

### map

>

### getMap

>

### getLayerById

> 根据图层 ID 获取图层对象 <br/>`@param` id 图层 ID<br/>`@return` {BaseLayer \| undefined} 图层对象

### panTo

> 平移到指定位置 <br/>`@param` AnimationOptions 动画参数<br/>`@link` https://openlayers.org/en/latest/apidoc/module-ol_View.html#~AnimationOptions

### flyTo

>

### exportPNG

> 将当前地图各 Canvas 图层合成为 PNG 并触发下载。`downloadName` 可省略 `.png`；未传时使用地图目标 ID 生成文件名。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { OlMapInstance } from "v3-ol-map";

const mapRef = ref<OlMapInstance>();
const exportMap = () => mapRef.value?.exportPNG("map-export");
</script>

<template>
  <button type="button" @click="exportMap">导出 PNG</button>
  <ol-map ref="mapRef">
    <ol-tile tile-type="BAIDU" />
  </ol-map>
</template>
```

跨域瓦片或图片必须允许 Canvas 跨域访问，否则浏览器会阻止生成 PNG。

### readFeatures

>

### setCursor

>

---
