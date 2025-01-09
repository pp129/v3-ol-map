# Map 地图容器

## 生成地图

<preview comp="map"></preview>

## view

地图视图，用于控制地图的缩放、中心点等
<preview comp="view"></preview>

## Map API

* 继承: `MapOptions`
* `MapOptions`中未继承的属性：`layers` | `overlays`
* 解构属性：[`view`](#view-api) | [`controls`](#controls-api) | [`interactions`](#interactions-api)
  
<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html#Map" title="MapOptions"></docs-iframe>

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
