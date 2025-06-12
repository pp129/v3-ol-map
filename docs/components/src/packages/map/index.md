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

### readFeatures

>

### setCursor

>

---
