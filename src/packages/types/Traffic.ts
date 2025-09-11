import OlTraffic from "../ext/traffic/index.vue";
import { BaseLayerOptions } from "../layers/baseLayer/index";

export interface TrafficOptions extends BaseLayerOptions {
  /**
   * 是否显示交通流量层
   */
  visible?: boolean;
  /**
   * 交通层透明度 (0-1)
   */
  opacity?: number;
  /**
   * 交通数据更新间隔(毫秒)
   */
  updateInterval?: number;
  /**
   * 是否显示路况图例
   */
  showLegend?: boolean;
  /**
   * 服务地址，必填参数
   */
  url: string;
  /**
   * 请求参数，默认使用 FormData 格式
   */
  requestParams?: Record<string, string | boolean | number>;
  /**
   * 附加过滤条件，会与自动生成的层级过滤条件组合
   * 最终的where参数格式："roadclass in (1,2,3,4,5) AND (这里的内容)"
   */
  where?: string;
  /**
   * 获取指定几何范围内的路况数据
   * 如果不指定，则自动使用当前地图视窗范围
   */
  geometry?: string;
  /**
   * 路况颜色配置数组
   * 索引对应：[0: state=1畅通, 1: state=2缓慢, 2: state=3拥堵, 3: state=4严重拥堵, 4: state=-1无数据]
   */
  colors?: string[];
  /**
   * 线条宽度
   */
  lineWidth?: number;
}

export declare type OlTrafficInstance = InstanceType<typeof OlTraffic>;
