# Overview 鹰眼/缩略图组件

<preview comp="overview"></preview>

## Overview API

* 继承: `OverviewMapOptions`
  
<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_control_OverviewMap-OverviewMap.html#OverviewMap" title="OverviewMapOptions"></docs-iframe>

* 继承: [TileLayerOptions](#tilelayeroptions)

### TileLayerOptions

* 继承: `BaseTileLayerOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_layer_BaseTile-BaseTileLayer.html#BaseTileLayer" title="BaseTileLayerOptions"></docs-iframe>

* 扩展属性: `tileType` | `layerId` | `source`

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tileType | 图层类型 | [`enum`](#tiletype) | - |
| layerId | 图层ID | `string` | - |
| source | 图层源 | [SourceOptions](#sourceoptions) | - |

### tileType

`'TDT'` | `'TDT_SATELLITE'` | `'TDT_TERRAIN'` | `'MAPBOX'` | `'BAIDU'` | `'BAIDU_SATELLITE'` | `'BAIDU_MIDNIGHT'` | `'AMAP'` | `'AMAP_SATELLITE'` | `'GEOTIFF'` | `'CUSTOMER'` | `'XYZ'` | `'OSM'`

枚举说明：

```js
enum tileType {
  TDT = "天地图",
  TDT_SATELLITE = "天地图-卫星影像",
  TDT_TERRAIN = "天地图-地形图",
  MAPBOX = "MAPBOX",
  BAIDU = "百度-矢量",
  BAIDU_SATELLITE = "百度-卫星影像",
  BAIDU_MIDNIGHT = "百度-午夜蓝",
  AMAP = "高德-矢量",
  AMAP_SATELLITE = "高德-卫星影像",
  GEOTIFF = "GEOTIFF",
  CUSTOMER = "CUSTOMER",
  XYZ = "XYZ",
  OSM = "OSM",
}
```

### SourceOptions

* 继承: `TileSourceOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_source_Tile-TileSource.html#TileSource" title="TileSourceOptions"></docs-iframe>

* 解构属性: `tileGrid`继承自：`TileGridOptions`

<docs-iframe url="https://openlayers.org/en/latest/apidoc/module-ol_tilegrid_TileGrid-TileGrid.html#TileGrid" title="TileGridOptions"></docs-iframe>
