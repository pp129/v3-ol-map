/**
 * 从类型定义自动生成 Storybook argTypes
 * 使用 TypeScript 的类型系统提取属性信息
 */

import type { ArgTypes } from "@storybook/vue3";

/**
 * 生成对象类型的详细描述
 * @param properties - 属性描述对象
 * @returns 格式化的类型字符串
 */
export function generateTypeDetail(properties: Record<string, string>): string {
  const entries = Object.entries(properties);
  if (entries.length === 0) return "{}";

  const maxKeyLength = Math.max(...entries.map(([key]) => key.length));

  return entries
    .map(([key, desc]) => {
      const padding = " ".repeat(maxKeyLength - key.length);
      return `  ${key}${padding} - ${desc}`;
    })
    .join("\n");
}

/**
 * View 类型的属性定义
 * 基于 ol/View.ViewOptions 扩展
 */
export const viewProperties: Record<string, string> = {
  city: "string | undefined - 城市名称（自定义扩展）",
  center: "[number, number] | undefined - 中心点坐标 [经度, 纬度]",
  zoom: "number | undefined - 缩放级别",
  minZoom: "number | undefined - 最小缩放级别",
  maxZoom: "number | undefined - 最大缩放级别",
  rotation: "number | undefined - 旋转角度（弧度）",
  projection: "string | ProjectionLike | undefined - 投影坐标系",
  extent: "Extent | undefined - 视图范围约束",
  constrainOnlyCenter: "boolean | undefined - 是否仅约束中心点",
  smoothExtentConstraint: "boolean | undefined - 平滑范围约束",
  minResolution: "number | undefined - 最小分辨率",
  maxResolution: "number | undefined - 最大分辨率",
  resolution: "number | undefined - 分辨率",
  resolutions: "number[] | undefined - 分辨率数组",
  zoomFactor: "number | undefined - 缩放因子",
  padding: "[number, number, number, number] | undefined - 内边距",
  constrainResolution: "boolean | undefined - 约束分辨率",
  showFullExtent: "boolean | undefined - 显示完整范围",
  multiWorld: "boolean | undefined - 多世界模式",
};

/**
 * 生成 View 类型的 argTypes 配置
 */
export function generateViewArgType(): ArgTypes {
  return {
    view: {
      description: `地图视图配置，继承自 [ol/View.ViewOptions](https://openlayers.org/en/latest/apidoc/module-ol_View-ViewOptions.html)`,
      table: {
        type: {
          summary: "View extends ViewOptions",
          detail: generateTypeDetail(viewProperties),
        },
      },
    },
  };
}

/**
 * 通用类型生成器
 * @param typeName - 类型名称
 * @param extendsFrom - 继承自
 * @param properties - 属性定义
 * @param docUrl - 文档链接
 */
export function generateObjectArgType(
  typeName: string,
  extendsFrom: string,
  properties: Record<string, string>,
  docUrl?: string,
): ArgTypes {
  const description = docUrl
    ? `${typeName} 类型，继承自 [${extendsFrom}](${docUrl})`
    : `${typeName} 类型，继承自 ${extendsFrom}`;

  return {
    [typeName.toLowerCase()]: {
      description,
      table: {
        type: {
          summary: `${typeName} extends ${extendsFrom}`,
          detail: generateTypeDetail(properties),
        },
      },
    },
  };
}
