# 开始

全局引用和按需引用示例

## 全局引用

```ts
// main.ts
import { createApp } from 'vue'
import VOlMap from "v3-ol-map";
import App from './App.vue'

const app = createApp(App)

app.use(VOlMap)
app.mount('#app')
```
## 按需引用

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


