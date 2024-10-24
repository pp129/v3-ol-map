import TileLayer from "ol/layer/Tile.js";
import GeoTIFFLayer from "ol/layer/WebGLTile.js";
import { GeoTIFF, XYZ } from "ol/source.js";
import type { Options as tileGridOptions } from "ol/tilegrid/TileGrid.js";
import TileGrid from "ol/tilegrid/TileGrid.js";
import type { Options as XYZOptions } from "ol/source/XYZ";
import type { Options as GeoTIFFOptions } from "ol/source/GeoTIFF";
import type { BaseTileProps } from "../../types/Tile";

// 通用XYZ图层加载
const tileRender = (layerOptions: BaseTileProps, sourceOptions: XYZOptions) => {
  let tileGrid: tileGridOptions | undefined = undefined;
  if (sourceOptions.tileGrid) {
    tileGrid = { resolutions: [], ...sourceOptions.tileGrid };
  }
  return new TileLayer({
    ...layerOptions,
    source: new XYZ({
      wrapX: false,
      tileGrid: tileGrid ? new TileGrid({ ...tileGrid }) : undefined,
      ...sourceOptions,
    }),
  });
};

const tempTileRender = (layerOptions: BaseTileProps) => {
  return new TileLayer({
    ...layerOptions,
    source: undefined,
  });
};

// 百度地图加载
const baiduRender = (layerOptions: BaseTileProps, sourceOptions: XYZOptions | undefined, url: string) => {
  const resolutions = [];
  for (let i = 0; i < 19; i++) {
    resolutions[i] = Math.pow(2, 18 - i);
  }
  const tileGrid = new TileGrid({
    origin: [0, 0], // 设置原点坐标
    resolutions, // 设置分辨率
  });
  // 创建百度地图的数据源
  const sourceOption = {
    ...sourceOptions,
    url: "",
    projection: "BD:09",
    tileGrid: tileGrid,
    tileUrlFunction: function (tileCoord: number[]) {
      if (!tileCoord) {
        return "";
      }
      const z = tileCoord[0];
      const x = tileCoord[1];
      const y = -tileCoord[2] - 1;
      return url.replace("{x}", x.toString()).replace("{y}", y.toString()).replace("{z}", z.toString());
    },
    crossOrigin: "anonymous",
  };
  const source = new XYZ(sourceOption);
  return new TileLayer({
    ...layerOptions,
    source,
  });
};

// GeoTIFF图层加载
const geotiffRender = (layerOptions: BaseTileProps, sourceOptions?: GeoTIFFOptions) => {
  const layerOpt = {
    ...layerOptions,
    source: new GeoTIFF(<GeoTIFFOptions>sourceOptions),
  };
  return new GeoTIFFLayer(layerOpt);
};

export default tileRender;

export { baiduRender, geotiffRender, tempTileRender };
