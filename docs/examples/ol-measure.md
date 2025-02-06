# Measure 测量

<preview comp="measure"></preview>

## Measure API

| 属性名 | 类型 | 默认值 | 描述 | 可选值 |
| --- | --- | --- | --- | --- |
| type | string | `''` | 测量类型| `'length'`、`'area'`、`''`、`undefined`、`null` |
| showSegments | boolean | `false` | 是否显示分段 | `true`、`false` |
| clearPrevious | boolean | `false` | 是否清除之前的测量 | `true`、`false` |

## Measure Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| clear | 清除测量结果| - |  
| setActive | 激活、取消测量| `active: boolean` |
