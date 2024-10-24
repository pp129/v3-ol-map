import {
  Projection,
  addEquivalentProjections,
  addEquivalentTransforms,
  addProjection,
  addCoordinateTransforms,
} from "ol/proj.js";

import { PROJECTIONS as EPSG3857_PROJECTIONS } from "ol/proj/epsg3857.js";
import { PROJECTIONS as EPSG4326_PROJECTIONS } from "ol/proj/epsg4326.js";
import * as projZh from "./transform";
import proj4 from "proj4";
import { register } from "ol/proj/proj4.js";

const definedProjection = () => {
  // 注册自定义投影信息
  proj4.defs("EPSG:3395", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
  proj4.defs(
    "EPSG:4548",
    "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs",
  );

  proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs +type=crs");
  register(proj4);

  const projection4490 = new Projection({
    code: "EPSG:4490",
    units: "degrees",
    axisOrientation: "neu",
  });
  projection4490.setExtent([-180, -90, 180, 90]);
  projection4490.setWorldExtent([-180, -90, 180, 90]);
  addProjection(projection4490);
  addCoordinateTransforms(
    "EPSG:4326",
    "EPSG:4490",
    function (coordinate) {
      return proj4("EPSG:4326", "EPSG:4490", coordinate);
    },
    function (coordinate) {
      return proj4("EPSG:4490", "EPSG:4326", coordinate);
    },
  );
  addCoordinateTransforms(
    "EPSG:3857",
    "EPSG:4490",
    function (coordinate) {
      return proj4("EPSG:3857", "EPSG:4490", coordinate);
    },
    function (coordinate) {
      return proj4("EPSG:4490", "EPSG:3857", coordinate);
    },
  );

  // 高德坐标定义注册
  const gcj02mc = new Projection({
    code: "GCJ:02",
    axisOrientation: "enu",
    // transformFun 函数 transform(coordinate, source, destination)
    // extent: applyTransform([-180, -90, 180, 90], projZh.ll2gcj02mc),
    extent: [-20037508.342789244, -20037508.34278071, 20037508.342789244, 20037508.34278071],
    worldExtent: [-180, -85, 180, 85],
    global: true,
    units: "m",
    getPointResolution: function (resolution, point) {
      return resolution / Math.cosh(point[1] / 6378137);
    },
  });

  addEquivalentProjections([gcj02mc]);
  addEquivalentTransforms(EPSG4326_PROJECTIONS, [gcj02mc], projZh.ll2gcj02mc, projZh.gcj02mc2ll);
  addEquivalentTransforms(EPSG3857_PROJECTIONS, [gcj02mc], projZh.mc2gcj02mc, projZh.gcj02mc2mc);

  // 百度坐标定义注册  const RADIUS = 6378137;
  const baiduMercatorProj = new Projection({
    code: "BD:09",
    axisOrientation: "enu",
    // extent: applyTransform([72.004, 0.8293, 137.8347, 55.8271], projZh.ll2bmerc),
    extent: [-33554432, -33554432, 33554432, 33554432],
    worldExtent: [-180, -85, 180, 85],
    global: true,
    units: "m",
    getPointResolution: function (resolution, point) {
      return resolution / Math.cosh(point[1] / 6378137);
    },
  });
  addEquivalentProjections([baiduMercatorProj]);
  addEquivalentTransforms(EPSG4326_PROJECTIONS, [baiduMercatorProj], projZh.ll2bmerc, projZh.bmerc2ll);
  addEquivalentTransforms(EPSG3857_PROJECTIONS, [baiduMercatorProj], projZh.smerc2bmerc, projZh.bmerc2smerc);

  // 新增兼容海图3395左边系数据 - register没有生成投影注册
  const projection3395 = new Projection({
    code: "EPSG:3395",
    extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
    worldExtent: [-180, -80, 180, 84],
    global: true,
    units: "m",
    axisOrientation: "neu",
  });
  addProjection(projection3395);
  // const projection4548 = new Projection({
  //   code: "EPSG:4548",
  //   // extent: [345754.3, 2500241.09, 654245.7, 5528578.96], // worldExtent: [-180, -80, 180, 84],
  //   // global: true,
  //   units: "m",
  //   axisOrientation: "enu",
  // });
  // addProjection(projection4548);
  addCoordinateTransforms(
    "EPSG:4326",
    "EPSG:3395",
    function (coordinate) {
      return proj4("EPSG:4326", "EPSG:3395", coordinate);
    },
    function (coordinate) {
      return proj4("EPSG:3395", "EPSG:4326", coordinate);
    },
  );
  addCoordinateTransforms(
    "EPSG:3857",
    "EPSG:3395",
    function (coordinate) {
      return proj4("EPSG:3857", "EPSG:3395", coordinate);
    },
    function (coordinate) {
      return proj4("EPSG:3395", "EPSG:3857", coordinate);
    },
  );

  // 扩展海图与第三方电子底图的投影转换【百度|高德】
  addCoordinateTransforms(
    "GCJ:02",
    "EPSG:3395",
    function (coordinate) {
      const coord = projZh.gcj02mc2mc(coordinate, coordinate, undefined, undefined);
      return proj4("EPSG:3857", "EPSG:3395", coord);
    },
    function (coordinate) {
      const coord = proj4("EPSG:3395", "EPSG:3857", coordinate);
      return projZh.mc2gcj02mc(coord, coord, undefined, undefined);
    },
  );
  addCoordinateTransforms(
    "BD:09",
    "EPSG:3395",
    function (coordinate) {
      const coord = projZh.bmerc2smerc(coordinate, coordinate, undefined, undefined);
      return proj4("EPSG:3857", "EPSG:3395", coord);
    },
    function (coordinate) {
      const coord = proj4("EPSG:3395", "EPSG:3857", coordinate);
      return projZh.smerc2bmerc(coord, coord, undefined, undefined);
    },
  );

  // 第三方图层定义内容转换
  addEquivalentTransforms([baiduMercatorProj], [gcj02mc], projZh.bmerc2gcj02mc, projZh.gcj02mc2bmerc);

  addEquivalentTransforms([gcj02mc], [baiduMercatorProj], projZh.gcj02mc2bmerc, projZh.bmerc2gcj02mc);
  // }
};

export default definedProjection;
