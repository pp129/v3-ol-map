import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { containsCoordinate } from "ol/extent";
import { LineString, Polygon } from "ol/geom";
import { Fill, Stroke, Style, Text } from "ol/style";
import OlMap from "ol/Map";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";

type XY = {
  x: number;
  y: number;
};
type TypeBounds = {
  min: XY;
  max: XY;
};
type Point = {
  position: import("ol/coordinate").Coordinate;
  text: string;
};

type TextBound = {
  intersects: (arg: TypeBounds) => boolean;
  min: XY;
  max: XY;
};
type textComp = {
  polyline: Feature;
  textBack: Feature;
  text: string;
};
class Bounds {
  min = { x: 0, y: 0 };
  max = { x: 0, y: 0 };
  constructor(min: XY, max: XY) {
    this.min = min;
    this.max = max;
  }

  intersects(bounds: TypeBounds) {
    const min = this.min;
    const max = this.max;
    const min2 = bounds.min;
    const max2 = bounds.max;
    return max2.x <= min.x || min2.x >= max.x || max2.y <= min.y || min2.y >= max.y;
  }
}

export interface Options {
  map?: OlMap;
  pointsArr: Point[]; // [{position:[],text:""}]
  zoom: number;
  styleOptions?: {
    fillColor: string;
    strokeColor: string;
    textColor: string;
    fontCss: string;
    boxWidth: number;
  };
  zIndex?: number;
}

export default class AvoidanceLayer extends VectorLayer {
  map: OlMap | undefined;
  pointsArr: Point[] = [];
  zoom = 1;
  textBounds: TextBound[] = [];

  styleOptions = {
    fillColor: "rgb(26,58,91,0.6)",
    strokeColor: "rgb(26,58,91)",
    textColor: "white",
    fontCss: "bolder 15px sans-serif",
    boxWidth: 50,
  };

  textViewCom = <{ text: string }[]>[];
  source: VectorSource;

  constructor(options: Options) {
    const baseOptions = Object.assign({}, options);
    delete baseOptions.map;
    super(baseOptions);
    this.map = options.map;
    this.pointsArr = options.pointsArr ? options.pointsArr : this.pointsArr;
    this.zoom = options.zoom ? options.zoom : 1;
    this.styleOptions = options.styleOptions ? options.styleOptions : this.styleOptions;
    this.source = this.getSource() || new VectorSource();
    this.setSource(this.source);
    this.map?.on("moveend", (evt: any) => {
      console.log(999);
      this.moveEnd();
    });
  }

  moveEnd() {
    const zoom = this.map?.getView()?.getZoom() || 0;
    if (zoom >= this.zoom) {
      this.drawText().then(() => {
        this.source.clear();
        const features = this.get("textComponent");
        console.log(111, features);
        if (features && features.length > 0) {
          features.forEach((feature: textComp) => {
            this.getSource()?.addFeature(feature.polyline);
            this.getSource()?.addFeature(feature.textBack);
          });
        }
      });
      // this.keepVisible();
    } else {
      this.source.clear();
    }
    // this.map?.once("moveend", (evt: any) => {
    //   this.moveEnd();
    // });
  }

  async drawText() {
    const style = this.styleOptions;
    // this.source.clear();
    const textCanvas = document.createElement("canvas");
    const textContext = textCanvas.getContext("2d");
    if (!textContext) return;
    style.fontCss && (textContext.font = style.fontCss);

    this.map?.once("postrender", async () => {
      const textComponent: textComp[] = [];
      this.pointsArr.forEach(element => {
        const transCor = fromLonLat(element.position, "EPSG:4326");
        const pixel = this.map?.getPixelFromCoordinate(transCor) || [0, 0];
        if (containsCoordinate(this.map?.getView().calculateExtent() || [0, 0], transCor)) {
          element.text = element.text || "";
          // --兼容特殊字符或较长字符的情况
          let textPixel = style.boxWidth || Math.ceil(textContext.measureText(element.text).width);
          textPixel += 30;
          // console.log("textPixel", textPixel);
          // 在点右上侧
          const rightTopMinx = pixel[0] + 10;
          const rightTopMaxx = pixel[0] + textPixel;
          const rightTopMiny = pixel[1] - 40;
          const rightTopMaxy = pixel[1] - 10;
          const rightTopCenter = [rightTopMinx, Number(((rightTopMiny + rightTopMaxy) / 2).toFixed(0))];
          const rightTopMin = {
            x: rightTopMinx,
            y: rightTopMiny,
          };
          const rightTopMax = {
            x: rightTopMaxx,
            y: rightTopMaxy,
          };
          const rightTopBounds = new Bounds(rightTopMin, rightTopMax);

          // 在点左上侧
          const leftTopMinx = pixel[0] - textPixel;
          const leftTopMaxx = pixel[0] - 10;
          const leftTopMiny = pixel[1] - 40;
          const leftTopMaxy = pixel[1] - 10;
          const leftTopCenter = [leftTopMaxx, Number(((leftTopMiny + leftTopMaxy) / 2).toFixed(0))];
          const leftTopMin = {
            x: leftTopMinx,
            y: leftTopMiny,
          };
          const leftTopMax = {
            x: leftTopMaxx,
            y: leftTopMaxy,
          };
          const leftTopBounds = new Bounds(leftTopMin, leftTopMax);

          // 在点左下侧
          const leftBomMinx = pixel[0] - textPixel;
          const leftBomMaxx = pixel[0] - 10;
          const leftBomMiny = pixel[1] + 10;
          const leftBomMaxy = pixel[1] + 40;
          const leftBomCenter = [leftBomMaxx, Number(((leftBomMiny + leftBomMaxy) / 2).toFixed(0))];
          const leftBomMin = {
            x: leftBomMinx,
            y: leftBomMiny,
          };
          const leftBomMax = {
            x: leftBomMaxx,
            y: leftBomMaxy,
          };
          const leftBomBounds = new Bounds(leftBomMin, leftBomMax);

          // 在点右下侧
          const rightBomMinx = pixel[0] + 10;
          const rightBomMaxx = pixel[0] + textPixel;
          const rightBomMiny = pixel[1] + 10;
          const rightBomMaxy = pixel[1] + 40;
          const rightBomCenter = [rightBomMinx, Number(((rightBomMiny + rightBomMaxy) / 2).toFixed(0))];
          const rightBomMin = {
            x: rightBomMinx,
            y: rightBomMiny,
          };
          const rightBomMax = {
            x: rightBomMaxx,
            y: rightBomMaxy,
          };

          // bounds 为该文字在 canvas 中所占据的范围
          const rightBomBounds = new Bounds(rightBomMin, rightBomMax);
          const RT = {
            bound: rightTopBounds,
            minx: rightTopMinx,
            miny: rightTopMiny,
            maxx: rightTopMaxx,
            maxy: rightTopMaxy,
            polylineCenter: rightTopCenter,
          };
          const LT = {
            bound: leftTopBounds,
            minx: leftTopMinx,
            miny: leftTopMiny,
            maxx: leftTopMaxx,
            maxy: leftTopMaxy,
            polylineCenter: leftTopCenter,
          };
          const LB = {
            bound: leftBomBounds,
            minx: leftBomMinx,
            miny: leftBomMiny,
            maxx: leftBomMaxx,
            maxy: leftBomMaxy,
            polylineCenter: leftBomCenter,
          };
          const RB = {
            bound: rightBomBounds,
            minx: rightBomMinx,
            miny: rightBomMiny,
            maxx: rightBomMaxx,
            maxy: rightBomMaxy,
            polylineCenter: rightBomCenter,
          };

          const Directs = new Map([
            ["rightTopBounds", RT],
            ["leftTopBounds", LT],
            ["leftBomBounds", LB],
            ["rightBomBounds", RB],
          ]);
          // 标识名称弹框放在右上侧还是左上侧
          let isCollision = true;
          let minx = 0;
          let miny = 0;
          let maxx = 0;
          let maxy = 0;
          let PLCenter = [0, 0];
          let flag = "";

          for (const [key, values] of Directs) {
            for (let i = 0; i < this.textBounds.length; i++) {
              const pointBounds = this.textBounds[i];
              isCollision = pointBounds.intersects(values.bound);
              if (!isCollision) {
                break;
              }
            }
            if (isCollision) {
              flag = key;
            }
          }

          // 如果没有与已绘制文字碰撞，则将该文字的范围添加到数组中，并进行绘制操作
          if (!isCollision) {
            return;
          }
          for (const [key, value] of Directs) {
            if (key === flag) {
              this.textBounds.push(value.bound);
              PLCenter = value.polylineCenter;
              minx = value.minx;
              miny = value.miny;
              maxx = value.maxx;
              maxy = value.maxy;
            }
          }
          const leftTop = this.map?.getCoordinateFromPixel([minx, miny]) || [];
          const rightTop = this.map?.getCoordinateFromPixel([maxx, miny]) || [];
          const rightBom = this.map?.getCoordinateFromPixel([maxx, maxy]) || [];
          const leftBom = this.map?.getCoordinateFromPixel([minx, maxy]) || [];
          // 绘制文字标签
          const textBack = new Feature(new Polygon([[leftTop, rightTop, rightBom, leftBom]]));
          textBack.setStyle(
            new Style({
              text: new Text({
                font: style.fontCss,
                fill: new Fill({
                  color: style.textColor,
                }),
                backgroundFill: new Fill({
                  color: style.fillColor,
                }),
                backgroundStroke: new Stroke({
                  color: style.strokeColor,
                }),
                offsetY: 0.5,
                overflow: true,
              }),
            }),
          );
          const featureStyle = textBack.getStyle() as Style;
          featureStyle.getText()?.setText(element.text);
          // 绘制文字箭头指向
          const polylineCenter_ = this.map?.getCoordinateFromPixel(PLCenter) || [0, 0];
          // console.log([element.position, polylineCenter_]);
          const polyline = new Feature(new LineString([element.position, polylineCenter_]));
          polyline.setStyle(
            new Style({
              stroke: new Stroke({
                color: style.strokeColor,
              }),
            }),
          );
          // 设置标签组合对象
          textComponent.push({
            textBack,
            polyline,
            text: element.text,
          });
        }
      });
      this.set("textComponent", textComponent);
    });
  }

  keepVisible() {
    this.textViewCom = this.get("invisible");
    console.log("invisible", this.textViewCom);
    if (!this.textViewCom) return;
    for (let i = this.textViewCom.length - 1; i >= 0; i--) {
      const object = this.textViewCom[i];
      this.textVisibility(object.text, false);
    }
  }

  textVisibility(textContent: string, visible: boolean) {
    let res: textComp[] = this.getObjectByText(textContent);
    this.textViewCom = this.get("invisible");
    let isContains = false;
    let index = 0;
    if (this.textViewCom instanceof Array) {
      for (let i = this.textViewCom?.length - 1; i >= 0; i--) {
        let obj = this.textViewCom[i];
        textContent === obj.text && ((isContains = true), (index = i));
      }
    }

    if (res.length > 0) {
      for (let i = res.length - 1; i >= 0; i--) {
        let textComponent = res[i];

        if (!visible) {
          if (this.textViewCom instanceof Array) {
            !isContains && this.textViewCom.push(textComponent);
          } else {
            this.set("invisible", [textComponent]);
          }
          textComponent.textBack?.setStyle(undefined);
          textComponent.polyline?.setStyle(undefined);
        } else {
          if (this.textViewCom instanceof Array && isContains) {
            this.textViewCom.splice(index, 1);
            let tmp = this.getObjectByText(textComponent.text);
            for (let i = tmp.length - 1; i >= 0; i--) {
              tmp[i].textBack?.setStyle(undefined);
              tmp[i].polyline?.setStyle(undefined);
            }
          }
        }
      }
    } else {
      if (!visible) {
        if (this.textViewCom instanceof Array) {
          !isContains && this.textViewCom.push({ text: textContent });
        } else {
          this.set("invisible", [
            {
              text: textContent,
            },
          ]);
        }
      } else {
        isContains && this.textViewCom.splice(index, 1);
      }
    }
  }

  getObjectByText(text: string): textComp[] {
    const textCom = this.get("textComponent");
    const result = [];
    for (let i = textCom?.length - 1; i >= 0; i--) {
      const object = textCom[i];
      if (object.text === text) {
        result.push(object);
      }
    }
    return result;
  }
}
