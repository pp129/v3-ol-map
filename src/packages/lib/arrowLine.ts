import Feature from "ol/Feature";
import Map from "ol/Map";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { Coordinate } from "ol/coordinate";
import VectorSource from "ol/source/Vector";
import { Options as IconOptions } from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector.js";

const formatLengthFromPixels = function (pixels: number[][]) {
  let length = 0;
  for (let i = 0, ii = pixels.length - 1; i < ii; ++i) {
    if (pixels[i + 1]) {
      length += Math.sqrt(Math.pow(pixels[i + 1][0] - pixels[i][0], 2) + Math.pow(pixels[i + 1][1] - pixels[i][1], 2));
    }
  }
  return length;
};

const getRotationFromPixel = function (current: Coordinate, target: Coordinate) {
  if (!current) return 0;
  let curPos = { x: current[0], y: current[1] };
  let targetPos = { x: target[0], y: target[1] };
  const x = Math.abs(targetPos.x - curPos.x);
  const y = Math.abs(targetPos.y - curPos.y);
  const z = Math.sqrt(x * x + y * y);
  const ration = Math.asin(y / z);
  let a = 0;
  if (targetPos.y < curPos.y && targetPos.x === curPos.x) {
    a = (Math.PI * 2) / 3;
  } else if (targetPos.y > curPos.y && targetPos.x === curPos.x) {
    a = Math.PI / 2;
  } else if (targetPos.y === curPos.y && targetPos.x < curPos.x) {
    a = Math.PI;
  } else if (targetPos.y === curPos.y && targetPos.x > curPos.x) {
    a = 0;
  } else if (targetPos.y > curPos.y && targetPos.x > curPos.x) {
    a = ration;
  } else if (targetPos.y > curPos.y && targetPos.x < curPos.x) {
    a = Math.PI - ration;
  } else if (targetPos.y < curPos.y && targetPos.x < curPos.x) {
    a = Math.PI + ration;
  } else if (targetPos.y < curPos.y && targetPos.x > curPos.x) {
    a = Math.PI * 2 - ration;
  }
  return a;
};

type ArrowLineParams = {
  map: Map;
  coordinates: Coordinate[];
  pixel: number;
};

const getArrowPoints = function (params: ArrowLineParams) {
  const map = params.map;
  const step = params.pixel;
  const _pathInfo = params.coordinates;
  const breakPoints = [];

  for (let n = 0; n < _pathInfo.length - 1; n++) {
    const initPos = _pathInfo[n];
    const targetPos = _pathInfo[n + 1];

    const INIT_POS = map.getPixelFromCoordinate(initPos);
    const TARGET_POS = map.getPixelFromCoordinate(targetPos);
    const LngLats = [INIT_POS, TARGET_POS];
    const length = formatLengthFromPixels(LngLats);
    const pointsSum = Math.floor(length / step);
    const rotate = getRotationFromPixel(INIT_POS, TARGET_POS);

    for (let p = 1; p < pointsSum + 1; p++) {
      const pixel = [INIT_POS[0] + step * p * Math.cos(rotate), INIT_POS[1] + step * p * Math.sin(rotate)];
      const coordinate = map.getCoordinateFromPixel(pixel);
      breakPoints.push({ rotate, coordinate });
    }
  }
  return breakPoints;
};

type createArrowsParams = {
  map: Map;
  layer?: VectorLayer;
  coordinates: Coordinate[];
  pixel?: number;
  icon?: IconOptions;
};

const createArrows = (params: createArrowsParams) => {
  const { map, layer, icon } = params;
  if (!layer) return;
  const source = layer.getSource();
  if (!source) return;
  const breakParams = {
    pixel: params.pixel || 50,
    coordinates: params.coordinates,
    map,
  };
  const breakPoints = getArrowPoints(breakParams);

  const src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfUlEQVQ4T3WTTSvFYRDFf8dLKIqytFckthTpJkQWlyhF2fgEVr6BheytpChEsqB08xbZWPgOJAs7ieRlNMzV//75P7vnmZkz58ycR2ZWD7QBF5KM1DGzTuBO0k065neZ2S3QBGwAU5I+iolmNgrsAI9An6SrNIgDnAE9EdgFJiS9+93MuoEToBx4AgYkXSZBHKAWOAS6IrAP5CW9BUge2AIqgJdg8guiSKoBDoDeDJBhwNlVBsiQpNPvGST0VgF7TjPeCsCIpNdo0g84O2fibx4r/AJEUjVwlJDjXbybU/eZjAGbMROXmC8BiKQ64BxoDyYLkuYTTCeB9WD/9B9AA3AMdGQAzALLAfCcluDF3r01itMS5oDFiP3MIUHNi90T7ko/XjyYGOIMsFJSXByimTVGQbFzegOuew0o+7PGKL4AmjM8MA2shua/RjIzX1suw8pucZfiUjOt/AC4BHfaeOoz+d63oziX9Zla3CzAkqTP9G8zM4/dS7r+7zt/Aaattn1kX8VgAAAAAElFTkSuQmCC";
  const scale = 0.5;

  for (let b = 0; b < breakPoints.length; b++) {
    const coordinates = breakPoints[b].coordinate;
    const rotate = breakPoints[b].rotate;
    const marker = new Feature({
      geometry: new Point(coordinates),
    });
    marker.setStyle(
      new Style({
        image: new Icon({
          src,
          scale,
          ...icon,
          rotation: rotate,
        }),
      }),
    );
    // linesFeatures.push(marker)
    marker.set("isArrow", true);
    source.addFeature(marker);
  }
};

type arrowLineParams = {
  map: Map;
  coordinates: Coordinate[];
  pixel?: number;
  layer?: VectorLayer;
};
export const arrowLine = (params: arrowLineParams) => {
  // console.log(params)
  if (!params.map || !params.coordinates || params.coordinates.length < 2) return;
  const { layer } = params;
  createArrows({ ...params, ...{ layer } });
};
