# Draw 绘制

<preview comp="draw"></preview>

## Draw API

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| :--- | :--- | :--- | :--- | :--- |
| type | 绘制类型 | `string`,`''`,`undefined`,`null` | `''` | `'Point'`, `'LineString'`, `'LinearRing'`,`'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,`'GeometryCollection'`, `'Circle'`, `Rectangle`, `Square`,`''`,`undefined`,`null` |
| snap | 是否可吸附 | `boolean` | `false` | `true`,`false` |
| modify | 是否可修改 | `boolean` | `false` | `true`,`false` |

## Draw Events

| 事件名 | 说明 | 参数 |
| :--- | :--- | :--- |
| drawstart | 绘制开始 | [DrawEvent](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw.DrawEvent.html) |
| drawend | 绘制结束 | [DrawEvent](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw.DrawEvent.html) |
| modifystart | 编辑开始 | [ModifyEvent](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify.ModifyEvent.html) |
| modifyend | 编辑结束 | [ModifyEvent](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify.ModifyEvent.html) |

## Draw Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| clear | 清除测量结果| - |  
| setActive | 激活、取消测量| `active: boolean` |
