import type { Feature, LineString, Position } from "geojson";
import { transform } from "../../packages/utils";

// 计算2个点的长度
function getDistance(e1: number, n1: number, e2: number, n2: number) {
  const R = 6371;
  const { sin, cos, asin, PI, hypot } = Math;
  /** 根据经纬度获取点的坐标 */
  let getPoint = (e: number, n: number) => {
    e *= PI / 180;
    n *= PI / 180;
    //这里 R* 被去掉, 相当于先求单位圆上两点的距, 最后会再将这个距离放大 R 倍
    return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) };
  };
  let a = getPoint(e1, n1);
  let b = getPoint(e2, n2);
  let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  let r = asin(c / 2) * 2 * R;
  return r * 1000;
}

// 计算两点平面角度
function getAngle(lng_a: number, lat_a: number, lng_b: number, lat_b: number) {
  let a = ((90 - lat_b) * Math.PI) / 180;
  let b = ((90 - lat_a) * Math.PI) / 180;
  let AOC_BOC = ((lng_b - lng_a) * Math.PI) / 180;
  let cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
  let sinc = Math.sqrt(1 - cosc * cosc);
  let sinA = (Math.sin(a) * Math.sin(AOC_BOC)) / sinc;
  let A = (Math.asin(sinA) * 180) / Math.PI;
  let res = 0;
  if (lng_b > lng_a && lat_b > lat_a) res = A;
  else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
  else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
  else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
  else if (lng_b > lng_a && lat_b === lat_a) res = 90;
  else if (lng_b < lng_a && lat_b === lat_a) res = 270;
  else if (lng_b === lng_a && lat_b > lat_a) res = 0;
  else if (lng_b === lng_a && lat_b < lat_a) res = 180;
  return res;
}
interface LinkObjType {
  linkId: number;
  roadName: string;
  coordList: number[];
  coordsArr: number[][];
  firstAngle: number;
  angle: number;
  lastAngle: number;
  lastPoint: Position;
  firstPoint: Position;
  lastPointStr: string;
  firstPointStr: string;
  roadclass: string;
}
interface CodeLineObjType {
  [name: string]: LinkObjType;
}
type LinkPObjType = Feature<LineString>;
export default class LinkFix {
  private CODELINE: CodeLineObjType = {};
  private CODELINE_A: CodeLineObjType = {};

  //1.1：处理路况数据 开始
  private TMCLINKARR: LinkObjType[] = [];
  private TMCLINKOBJ: LinkObjType[] = [];
  TMCLINKPOBJ: LinkPObjType[] = [];

  constructor(features: Feature[]) {
    this.initData(features);
    this.linkRender();
  }

  //路况接口路网数据成为OBJ对象（1.2接口）
  initData(linkArr: Feature[]) {
    // console.log("linkArr", linkArr);
    for (let i = 0; i < linkArr.length; i++) {
      const { properties }: any = linkArr[i];
      const { link_id, coord_list, road_name } = properties;
      this.TMCLINKOBJ[link_id] = {
        ...properties,
        coordList: JSON.parse(coord_list),
        roadName: road_name,
        linkId: link_id,
      };

      //处理1.2的坐标
      let coordsArr2: number[][] = [];
      for (let x = 0; x < this.TMCLINKOBJ[link_id].coordList.length; x++) {
        //尾点
        const coord = [this.TMCLINKOBJ[link_id].coordList[x], this.TMCLINKOBJ[link_id].coordList[x + 1]];
        coordsArr2.push(coord);
        x = x + 1;

        //角度赋值
        if (x === 3) {
          this.TMCLINKOBJ[this.TMCLINKOBJ[link_id].linkId].firstAngle = getAngle(
            this.TMCLINKOBJ[link_id].coordList[x - 3],
            this.TMCLINKOBJ[link_id].coordList[x - 2],
            this.TMCLINKOBJ[link_id].coordList[x - 1],
            this.TMCLINKOBJ[link_id].coordList[x],
          );
        }

        if (x === this.TMCLINKOBJ[link_id].coordList.length - 1) {
          this.TMCLINKOBJ[this.TMCLINKOBJ[link_id].linkId].angle = getAngle(
            this.TMCLINKOBJ[link_id].coordList[0],
            this.TMCLINKOBJ[link_id].coordList[1],
            this.TMCLINKOBJ[link_id].coordList[x - 1],
            this.TMCLINKOBJ[link_id].coordList[x],
          );
          this.TMCLINKOBJ[this.TMCLINKOBJ[link_id].linkId].lastAngle = getAngle(
            this.TMCLINKOBJ[link_id].coordList[x - 3],
            this.TMCLINKOBJ[link_id].coordList[x - 2],
            this.TMCLINKOBJ[link_id].coordList[x - 1],
            this.TMCLINKOBJ[link_id].coordList[x],
          );
        }
      }

      //获取一下首尾点
      let length = this.TMCLINKOBJ[link_id].coordList.length;
      const point1 = [this.TMCLINKOBJ[link_id].coordList[0], this.TMCLINKOBJ[link_id].coordList[1]]; //首点
      const point2 = [this.TMCLINKOBJ[link_id].coordList[length - 2], this.TMCLINKOBJ[link_id].coordList[length - 1]]; //尾点

      this.TMCLINKOBJ[link_id].lastPoint = point2;
      this.TMCLINKOBJ[link_id].firstPoint = point1;

      const p2x = point2[0].toFixed(5);
      const p2y = point2[1].toFixed(5);
      const p2str = p2x + "" + p2y;

      const p1x = point1[0].toFixed(5);
      const p1y = point1[1].toFixed(5);
      const p1str = p1x + "" + p1y;

      this.TMCLINKOBJ[link_id].lastPointStr = p2str;
      this.TMCLINKOBJ[link_id].firstPointStr = p1str;

      //充新编一下坐标数组
      // this.TMCLINKOBJ[link_id].coordList = coordsArr;
      this.TMCLINKOBJ[link_id].coordsArr = coordsArr2;

      //给LINK做位置编码，用于链接路口判定
      //结构：X4位小数（10米），Y4位小数（10米），道路等级(可选)，道路等功能(可选)，路名(可选)
      const code1 = point2[0].toFixed(4) + "_" + point2[1].toFixed(4);
      const code2 = code1 + "_" + this.TMCLINKOBJ[link_id].roadclass;

      this.CODELINE[code1] = this.TMCLINKOBJ[link_id];
      this.CODELINE[code2] = this.TMCLINKOBJ[link_id];

      this.CODELINE_A[p1str + "_" + p2str] = this.TMCLINKOBJ[link_id];

      this.TMCLINKARR.push(this.TMCLINKOBJ[link_id]);
    }
  }

  //流程2：绘制TMC道路分段-1.2接口
  linkRender() {
    //2.1绘制所有线段
    // console.log(this.TMCLINKOBJ);
    for (const x in this.TMCLINKOBJ) {
      //计算距离最近得link
      for (let i = 0; i < this.TMCLINKARR.length; i++) {
        const point1 = this.TMCLINKOBJ[x].coordsArr[0];
        const point2 = this.TMCLINKARR[i].coordsArr[this.TMCLINKARR[i].coordsArr.length - 1];

        const d = getDistance(point1[0], point1[1], point2[0], point2[1]);
        let e = 0;

        const p1x = point1[0].toFixed(5);
        const p1y = point1[1].toFixed(5);
        const p1str = p1x + "" + p1y;

        const p2x = point2[0].toFixed(5);
        const p2y = point2[1].toFixed(5);
        const p2str = p2x + "" + p2y;

        if (this.TMCLINKARR[i].lastPointStr === p1str) {
          e = 1;
        }

        let aa = 0;
        //LINK头和尾角度
        if (this.TMCLINKOBJ[x].firstAngle <= 30) {
          aa = Math.abs(this.TMCLINKOBJ[x].firstAngle - (this.TMCLINKARR[i].lastAngle - 360));
        }
        if (this.TMCLINKARR[i].lastAngle <= 30) {
          aa = Math.abs(this.TMCLINKOBJ[x].firstAngle - 360 - this.TMCLINKARR[i].lastAngle);
        }
        if (this.TMCLINKARR[i].lastAngle > 30 && this.TMCLINKOBJ[x].firstAngle > 30) {
          aa = Math.abs(this.TMCLINKOBJ[x].firstAngle - this.TMCLINKARR[i].lastAngle);
        }

        let diffaaa = 0;

        //补丁LINK和原始LINK角度
        const aaa = getAngle(point2[0], point2[1], point1[0], point1[1]);
        if (this.TMCLINKOBJ[x].firstAngle <= 30) {
          diffaaa = Math.abs(this.TMCLINKOBJ[x].firstAngle - (aaa - 360));
        }
        if (aaa <= 30) {
          diffaaa = Math.abs(this.TMCLINKOBJ[x].firstAngle - 360 - aaa);
        }
        if (aaa > 30 && this.TMCLINKOBJ[x].firstAngle > 20) {
          diffaaa = Math.abs(this.TMCLINKOBJ[x].firstAngle - aaa);
        }

        let o = 0;

        //距离判定
        if (d > 35) {
          o = 1;
        }

        //补丁线和路网是否有头尾重复线
        if (this.CODELINE_A[p2str + "_" + p1str]) {
          o = 1;
        }

        if (o === 0 && e === 0 && aa <= 15 && diffaaa <= 15) {
          //console.log(d)

          const arr = [
            [point2[0], point2[1]],
            [point1[0], point1[1]],
          ];

          const coords = arr.map(x => {
            return transform.gcj02towgs84(x[0], x[1]);
          });
          this.TMCLINKPOBJ.push({
            geometry: {
              coordinates: coords,
              type: "LineString",
            },
            properties: this.TMCLINKOBJ[x],
            type: "Feature",
          });
        }
      }
    }
  }
}
