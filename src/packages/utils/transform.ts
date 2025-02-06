import type { TransformFunction } from "ol/proj";
import type { Coordinate } from "ol/coordinate";

/**
 * 投影定义信息处理方法文件
 */

// 综合信息定义
const RADIUS = 6378137;
const MAX_LATITUDE = 85.0511287798;
const RAD_PER_DEG = Math.PI / 180;
const PI = Math.PI;
const AXIS = 6378245.0;
const OFFSET = 0.00669342162296594323;

// 百度附加信息
const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
const LLBAND = [75, 60, 45, 30, 15, 0];
const MC2LL = [
  [
    1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547,
    91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2,
  ],
  [
    -7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826,
    -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86,
  ],
  [
    -3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871,
    -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37,
  ],
  [
    -1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277,
    -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06,
  ],
  [
    3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511,
    -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4,
  ],
  [
    2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037,
    -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5,
  ],
];
const LL2MC = [
  [
    -0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700,
    26595700718403920, -10725012454188240, 1800819912950474, 82.5,
  ],
  [
    0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142,
    -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5,
  ],
  [
    0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253,
    97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5,
  ],
  [
    0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287,
    1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5,
  ],
  [
    -0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378,
    54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5,
  ],
  [
    -0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292,
    1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45,
  ],
];
const X_PI = (PI * 3000) / 180;

const forEachPoint = (func: (input: any, output: any, offset: any) => void) => {
  const transferFun = (input: string | any[], opt_output: any, opt_dimension: any) => {
    const len = input.length;
    const dimension = opt_dimension ? opt_dimension : 2;
    let output;
    if (opt_output) {
      output = opt_output;
    } else {
      if (dimension !== 2) {
        output = input.slice();
      } else {
        output = new Array(len);
      }
    }
    for (let offset = 0; offset < len; offset += dimension) {
      func(input, output, offset);
    }
    return output;
  };
  return transferFun;
};

const outOfChina = (lon: number, lat: number): boolean => {
  if (lon < 72.004 || lon > 137.8347) {
    return true;
  }
  if (lat < 0.8293 || lat > 55.8271) {
    return true;
  }
  return false;
};

const delta = (wgLon: number, wgLat: number): Array<number> => {
  let dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
  let dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
  const radLat = (wgLat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - OFFSET * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((AXIS * (1 - OFFSET)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((AXIS / sqrtMagic) * Math.cos(radLat) * PI);
  return [dLon, dLat];
};

const transformLat = (x: number, y: number): number => {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
};
const transformLon = (x: number, y: number): number => {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
};

const getRange = (v: number, min: number, max: number) => {
  v = Math.max(v, min);
  v = Math.min(v, max);
  return v;
};

const getLoop = (v: number, min: number, max: number) => {
  const d = max - min;
  while (v > max) {
    v -= d;
  }
  while (v < min) {
    v += d;
  }
  return v;
};

const convertor = (input: Array<number>, output: Array<number>, offset: number, table: any) => {
  const px = input[offset];
  const py = input[offset + 1];
  const x = table[0] + table[1] * Math.abs(px);
  const d = Math.abs(py) / table[9];
  const y =
    table[2] +
    table[3] * d +
    table[4] * d * d +
    table[5] * d * d * d +
    table[6] * d * d * d * d +
    table[7] * d * d * d * d * d +
    table[8] * d * d * d * d * d * d;
  output[offset] = x * (px < 0 ? -1 : 1);
  output[offset + 1] = y * (py < 0 ? -1 : 1);
};

const toGCJ02 = (input: Array<number>, output: Array<number>, offset: number) => {
  const x = input[offset] - 0.0065;
  const y = input[offset + 1] - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  output[offset] = z * Math.cos(theta);
  output[offset + 1] = z * Math.sin(theta);
  return output;
};

const fromGCJ02 = (input: Array<number>, output: Array<number>, offset: number) => {
  const x = input[offset];
  const y = input[offset + 1];
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  output[offset] = z * Math.cos(theta) + 0.0065;
  output[offset + 1] = z * Math.sin(theta) + 0.006;
  return output;
};

const sphericalMercator = {
  forward: forEachPoint((input: Coordinate, output: Coordinate, offset: number) => {
    const lat = Math.max(Math.min(MAX_LATITUDE, input[offset + 1]), -MAX_LATITUDE);
    const sin = Math.sin(lat * RAD_PER_DEG);
    output[offset] = RADIUS * input[offset] * RAD_PER_DEG;
    output[offset + 1] = (RADIUS * Math.log((1 + sin) / (1 - sin))) / 2;
  }),
  inverse: forEachPoint((input: Coordinate, output: Coordinate, offset: number) => {
    output[offset] = input[offset] / RADIUS / RAD_PER_DEG;
    output[offset + 1] = (2 * Math.atan(Math.exp(input[offset + 1] / RADIUS)) - Math.PI / 2) / RAD_PER_DEG;
  }),
};

const gcj02 = {
  toWGS84: forEachPoint((input: Array<number>, output: Array<number>, offset: number) => {
    let lng = input[offset];
    let lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      const deltaD = delta(lng, lat);
      lng = lng - deltaD[0];
      lat = lat - deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  }),
  fromWGS84: forEachPoint((input: Array<number>, output: Array<number>, offset: number) => {
    let lng = input[offset];
    let lat = input[offset + 1];
    if (!outOfChina(lng, lat)) {
      const deltaD = delta(lng, lat);
      lng = lng + deltaD[0];
      lat = lat + deltaD[1];
    }
    output[offset] = lng;
    output[offset + 1] = lat;
  }),
};

const baiduMercator = {
  // input: { [x: string]: number; }
  forward: forEachPoint((input: Coordinate, output: Coordinate, offset: number) => {
    const lng = getLoop(input[offset], -180, 180);
    const lat = getRange(input[offset + 1], -74, 74);
    // 转换参数注意为undefined的情况
    let table: any = null;
    let j;
    for (j = 0; j < LLBAND.length; ++j) {
      if (lat >= LLBAND[j]) {
        table = LL2MC[j];
        break;
      }
    }
    if (table === null) {
      for (j = LLBAND.length - 1; j >= 0; --j) {
        if (lat <= -LLBAND[j]) {
          table = LL2MC[j];
          break;
        }
      }
    }
    output[offset] = lng;
    output[offset + 1] = lat;
    convertor(output, output, offset, table);
  }),
  inverse: forEachPoint((input: Coordinate, output: Coordinate, offset: number) => {
    const y_abs = Math.abs(input[offset + 1]);
    // 转换参数注意为undefined的情况
    let table: any = null;
    for (let j = 0; j < MCBAND.length; j++) {
      if (y_abs >= MCBAND[j]) {
        table = MC2LL[j];
        break;
      }
    }
    convertor(input, output, offset, table);
  }),
};

const bd09 = {
  toWGS84: (input: number[], opt_output: number[] | undefined, opt_dimension: number | undefined) => {
    const output = forEachPoint(toGCJ02)(input, opt_output, opt_dimension);
    return gcj02.toWGS84(output, output, opt_dimension);
  },
  fromWGS84: (input: number[], opt_output: number[] | undefined, opt_dimension: number | undefined) => {
    const output = gcj02.fromWGS84(input, opt_output, opt_dimension);
    return forEachPoint(fromGCJ02)(output, output, opt_dimension);
  },
};

// 百度BD坐标转换定义
const smerc2bmerc: TransformFunction = (input, opt_output, opt_dimension) => {
  let output = sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = bd09.fromWGS84(output, output, opt_dimension);
  return baiduMercator.forward(output, output, opt_dimension);
};
const bmerc2smerc: TransformFunction = (input, opt_output, opt_dimension) => {
  let output = baiduMercator.inverse(input, opt_output, opt_dimension);
  output = bd09.toWGS84(output, output, opt_dimension);
  return sphericalMercator.forward(output, output, opt_dimension);
};
const bmerc2ll: TransformFunction = (input, opt_output, opt_dimension) => {
  const output = baiduMercator.inverse(input, opt_output, opt_dimension);
  return bd09.toWGS84(output, output, opt_dimension);
};
const ll2bmerc: TransformFunction = (input, opt_output, opt_dimension) => {
  const output = bd09.fromWGS84(input, opt_output, opt_dimension);
  return baiduMercator.forward(output, output, opt_dimension);
};
const bmerc2gcj02mc: TransformFunction = (input, opt_output, opt_dimension) => {
  // bmerc2smerc
  let output = baiduMercator.inverse(input, opt_output, opt_dimension);
  output = bd09.toWGS84(output, output, opt_dimension);

  // mc2gcj02mc
  output = gcj02.fromWGS84(output, output, opt_dimension);
  return sphericalMercator.forward(output, output, opt_dimension);
};

// 高德GCJ坐标转换定义
const mc2gcj02mc: TransformFunction = (input, opt_output, opt_dimension) => {
  let output = sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = gcj02.fromWGS84(output, output, opt_dimension);
  return sphericalMercator.forward(output, output, opt_dimension);
};
const gcj02mc2mc: TransformFunction = (input, opt_output, opt_dimension) => {
  let output = sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = gcj02.toWGS84(output, output, opt_dimension);
  return sphericalMercator.forward(output, output, opt_dimension);
};
const gcj02mc2ll: TransformFunction = (input, opt_output, opt_dimension) => {
  const output = sphericalMercator.inverse(input, opt_output, opt_dimension);
  return gcj02.toWGS84(output, output, opt_dimension);
};
const ll2gcj02mc: TransformFunction = (input, opt_output, opt_dimension) => {
  const output = gcj02.fromWGS84(input, opt_output, opt_dimension);
  return sphericalMercator.forward(output, output, opt_dimension);
};
const gcj02mc2bmerc: TransformFunction = (input, opt_output, opt_dimension) => {
  // gcj02mc2mc
  let output = sphericalMercator.inverse(input, opt_output, opt_dimension);
  output = gcj02.toWGS84(output, output, opt_dimension);

  // smerc2bmerc
  output = bd09.fromWGS84(output, output, opt_dimension);
  return baiduMercator.forward(output, output, opt_dimension);
};

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bdLon
 * @param bdLat
 * @returns {*[]}
 */
const bd09togcj02 = (bdLon: number, bdLat: number) => {
  bdLon = +bdLon;
  bdLat = +bdLat;
  const x = bdLon - 0.0065;
  const y = bdLat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  const GG_LNG = z * Math.cos(theta);
  const GG_LAT = z * Math.sin(theta);
  return [GG_LNG, GG_LAT];
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const gcj02tobd09 = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * X_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * X_PI);
  const BD_LNG = z * Math.cos(theta) + 0.0065;
  const bdLat = z * Math.sin(theta) + 0.006;
  return [BD_LNG, bdLat];
};

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const wgs84togcj02 = function (lng: number, lat: number) {
  lat = +lat;
  lng = +lng;
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    const radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - OFFSET * magic * magic;
    const sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((AXIS * (1 - OFFSET)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((AXIS / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat = lat + dlat;
    const mglng = lng + dlng;
    return [mglng, mglat];
  }
};

const wgs84tobd09 = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    const gcj02 = wgs84togcj02(lng, lat);
    const bd09 = gcj02tobd09(gcj02[0], gcj02[1]);
    return bd09;
  }
};

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
const gcj02towgs84 = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    const radlat = (lat / 180.0) * PI;
    let magic = Math.sin(radlat);
    magic = 1 - OFFSET * magic * magic;
    const sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / (((AXIS * (1 - OFFSET)) / (magic * sqrtmagic)) * PI);
    dlng = (dlng * 180.0) / ((AXIS / sqrtmagic) * Math.cos(radlat) * PI);
    const mglat = lat + dlat;
    const mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat];
  }
};

/**
 * 百度坐标系 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {number[]|*[]}
 */
const bd09towgs84 = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    const gcj02 = bd09togcj02(lng, lat);
    const gps84 = gcj02towgs84(gcj02[0], gcj02[1]);
    return gps84;
  }
};

const transformlat = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
};

const transformlng = (lng: number, lat: number) => {
  lat = +lat;
  lng = +lng;
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
};

export {
  // 投影转换
  bd09,
  gcj02,
  smerc2bmerc,
  bmerc2smerc,
  bmerc2ll,
  ll2bmerc,
  bmerc2gcj02mc,
  mc2gcj02mc,
  gcj02mc2mc,
  gcj02mc2ll,
  ll2gcj02mc,
  gcj02mc2bmerc,
  // 经纬度坐标系转换
  gcj02towgs84, // 高德转wgs84
  gcj02tobd09, // 高德转百度
  bd09towgs84, // 百度转wgs84
  bd09togcj02, // 百度转高德
  wgs84togcj02, // wgs84转高德
  wgs84tobd09, // wgs84转百度
};
