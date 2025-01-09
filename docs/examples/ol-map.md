# Map 地图容器

## 生成地图

<preview comp="map"></preview>

## Map API

* 继承: `MapOptions`
* `MapOptions`中未继承的属性：`layers` | `overlays`
* 解构属性：[`view`](#view-api) | [`controls`](#controls-api) | [`interactions`](#interactions-api)
  
<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#Map" title="MapOptions"></docs-iframe>

## Map 事件

| 事件名 | 说明  | Type |
| - | - | - |
| `load` | 加载完成  | `() => void` |
| `changeZoom` | 层级变化  | `(params:`[MapBrowserEvent](#mapevent)`, map: import("ol/Map").default) => void` |
| `singleclick` | 点击  | `(evt: any, map: import("ol/Map").default) => void` |
| `click` | 点击  | `(evt: any, map: import("ol/Map").default) => void` |
| `dblclick` | 双击  | `(evt: any, map: import("ol/Map").default) => void` |
| `pointerdrag` |   | `(evt: any, map: import("ol/Map").default) => void` |
| `contextmenu` | 右键点击地图 | `(evt: any, map: import("ol/Map").default) => void` |
| `precompose` | [precompose](https://openlayers.org/en/latest/apidoc/module-ol_render_Event-RenderEvent.html#event:precompose) | `(evt: any, map: import("ol/Map").default) => void` |
| `postrender` | [postrender](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:postrender) | `(evt: any, map: import("ol/Map").default) => void` |
| `loadend` | [loadend](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:loadend) | `(evt: any, map: import("ol/Map").default) => void` |
| `loadstart` | [loadstart](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:loadstart) | `(evt: any, map: import("ol/Map").default) => void` |
| `moveend` | [moveend](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:moveend) | `(evt: any, map: import("ol/Map").default) => void` |
| `movestart` | [movestart](https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:movestart) | `(evt: any, map: import("ol/Map").default) => void` |

### MapEvent

* 继承: `import("ol/MapBrowserEvent").default`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_MapBrowserEvent-MapBrowserEvent.html" title="MapBrowserEvent"></docs-iframe>

## Map Exposes

| 方法名 | 说明  | Type |
| - | - | - |
| `getMap` | 获取地图对象  | `() => import("ol/Map").default` |
| `getLayerById` | 根据id获取图层  | `function(id: string) => import("ol/layer/Layer").default` |
| `panTo` | 地图视窗移动  | `(params:`[AnimationOptions](#animationoptions)`) => void;` |

### AnimationOptions

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_View.html#~AnimationOptions" title="AnimationOptions"></docs-iframe>

## view

地图视图，用于控制地图的缩放、中心点等
<preview comp="view"></preview>

### View API

* 继承: `ViewOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_View.html#~ViewOptions" title="ViewOptions"></docs-iframe>

* 扩展属性: `city`
  
| 属性 | 说明 | 类型 | 默认值 |
| - | - | - | - |
| city | 以该城市的中心点为视图中点 | `string` | - |

### Controls API

* 继承: `ControlOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_control_defaults.html#.defaults" title="ol/control/defaults"></docs-iframe>

### Interactions API

* 继承: `InteractionOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_interaction_defaults.html#.defaults" title="ol/interaction/defaults"></docs-iframe>
