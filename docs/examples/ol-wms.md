# WMS图层

加载 WMS 图层，支持在 `OlImage` 中使用 ImageWMS，或在 `OlTile` 中使用 TileWMS。

<preview comp="wms"></preview>

## 属性查询开关

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `featureInfoEnabled` | `boolean` | `true` | 是否启用 GetFeatureInfo 查询，可动态切换。 |

默认保留 `singleclick`、`dblclick`、`pointermove` 查询事件，参数仍为 `(evt, featureInfo)`。
其中 `pointermove` 查询按 200ms 节流：首次立即执行，间隔内保留最后一个位置；单击、双击不节流。
同类事件的新位置会取消旧请求，迟到结果不会触发事件，鼠标移动不会取消点击查询。
请求失败仍返回 `null`；主动取消不报错，也不触发结果事件。

### 仅展示路况

```vue
<ol-image>
  <ol-wms
    :url="wms.url"
    :params="wms.params"
    :feature-info-enabled="false"
  />
</ol-image>
```

关闭后不绑定查询监听，不执行像素命中检测、不修改鼠标样式、不发送 GetFeatureInfo，
也不触发上述 `OlWms` 查询结果事件。`OlMap` 原始地图事件仍可用于点击等交互。
运行中关闭会取消在途查询及待执行的节流任务；重新开启恢复查询，不重建图层或 Source。

此开关不影响 GetMap 渲染和 `params` 深监听，原地修改 `wms.params.TIME` 或替换整个 `params`
均继续刷新图层。更新参数或卸载组件时也会清理旧查询，避免旧结果回传。

仓库中的 `src/examples/trafficWMS/index.vue` 路况示例已关闭属性查询，
保留 10 秒 TIME 刷新和地图双击筛选，可在 Storybook 的 `OlMap/Image` 中查看。
