import { pinyin } from "pinyin-pro";

const cityMap = [
  {
    name: "北京市",
    longitude: 116.405285,
    latitude: 39.904989,
  },
  {
    name: "天津市",
    longitude: 117.190182,
    latitude: 39.125596,
  },
  {
    name: "石家庄市",
    longitude: 114.502461,
    latitude: 38.045474,
  },
  {
    name: "唐山市",
    longitude: 118.175393,
    latitude: 39.635113,
  },
  {
    name: "秦皇岛市",
    longitude: 119.586579,
    latitude: 39.942531,
  },
  {
    name: "邯郸市",
    longitude: 114.490686,
    latitude: 36.612273,
  },
  {
    name: "邢台市",
    longitude: 114.508851,
    latitude: 37.0682,
  },
  {
    name: "保定市",
    longitude: 115.482331,
    latitude: 38.867657,
  },
  {
    name: "张家口市",
    longitude: 114.884091,
    latitude: 40.811901,
  },
  {
    name: "承德市",
    longitude: 117.939152,
    latitude: 40.976204,
  },
  {
    name: "沧州市",
    longitude: 116.857461,
    latitude: 38.310582,
  },
  {
    name: "廊坊市",
    longitude: 116.704441,
    latitude: 39.523927,
  },
  {
    name: "衡水市",
    longitude: 115.665993,
    latitude: 37.735097,
  },
  {
    name: "太原市",
    longitude: 112.549248,
    latitude: 37.857014,
  },
  {
    name: "大同市",
    longitude: 113.295259,
    latitude: 40.09031,
  },
  {
    name: "阳泉市",
    longitude: 113.583285,
    latitude: 37.861188,
  },
  {
    name: "长治市",
    longitude: 113.113556,
    latitude: 36.191112,
  },
  {
    name: "晋城市",
    longitude: 112.851274,
    latitude: 35.497553,
  },
  {
    name: "朔州市",
    longitude: 112.433387,
    latitude: 39.331261,
  },
  {
    name: "晋中市",
    longitude: 112.736465,
    latitude: 37.696495,
  },
  {
    name: "运城市",
    longitude: 111.003957,
    latitude: 35.022778,
  },
  {
    name: "忻州市",
    longitude: 112.733538,
    latitude: 38.41769,
  },
  {
    name: "临汾市",
    longitude: 111.517973,
    latitude: 36.08415,
  },
  {
    name: "吕梁市",
    longitude: 111.134335,
    latitude: 37.524366,
  },
  {
    name: "呼和浩特市",
    longitude: 111.670801,
    latitude: 40.818311,
  },
  {
    name: "包头市",
    longitude: 109.840405,
    latitude: 40.658168,
  },
  {
    name: "乌海市",
    longitude: 106.825563,
    latitude: 39.673734,
  },
  {
    name: "赤峰市",
    longitude: 118.956806,
    latitude: 42.275317,
  },
  {
    name: "通辽市",
    longitude: 122.263119,
    latitude: 43.617429,
  },
  {
    name: "鄂尔多斯市",
    longitude: 109.99029,
    latitude: 39.817179,
  },
  {
    name: "呼伦贝尔市",
    longitude: 119.758168,
    latitude: 49.215333,
  },
  {
    name: "巴彦淖尔市",
    longitude: 107.416959,
    latitude: 40.757402,
  },
  {
    name: "乌兰察布市",
    longitude: 113.114543,
    latitude: 41.034126,
  },
  {
    name: "兴安盟",
    longitude: 122.070317,
    latitude: 46.076268,
  },
  {
    name: "锡林郭勒盟",
    longitude: 116.090996,
    latitude: 43.944018,
  },
  {
    name: "阿拉善盟",
    longitude: 105.706422,
    latitude: 38.844814,
  },
  {
    name: "沈阳市",
    longitude: 123.429096,
    latitude: 41.796767,
  },
  {
    name: "大连市",
    longitude: 121.618622,
    latitude: 38.91459,
  },
  {
    name: "鞍山市",
    longitude: 122.995632,
    latitude: 41.110626,
  },
  {
    name: "抚顺市",
    longitude: 123.921109,
    latitude: 41.875956,
  },
  {
    name: "本溪市",
    longitude: 123.770519,
    latitude: 41.297909,
  },
  {
    name: "丹东市",
    longitude: 124.383044,
    latitude: 40.124296,
  },
  {
    name: "锦州市",
    longitude: 121.135742,
    latitude: 41.119269,
  },
  {
    name: "营口市",
    longitude: 122.235151,
    latitude: 40.667432,
  },
  {
    name: "阜新市",
    longitude: 121.648962,
    latitude: 42.011796,
  },
  {
    name: "辽阳市",
    longitude: 123.18152,
    latitude: 41.269402,
  },
  {
    name: "盘锦市",
    longitude: 122.06957,
    latitude: 41.124484,
  },
  {
    name: "铁岭市",
    longitude: 123.844279,
    latitude: 42.290585,
  },
  {
    name: "朝阳市",
    longitude: 120.451176,
    latitude: 41.576758,
  },
  {
    name: "葫芦岛市",
    longitude: 120.856394,
    latitude: 40.755572,
  },
  {
    name: "长春市",
    longitude: 125.3245,
    latitude: 43.886841,
  },
  {
    name: "吉林市",
    longitude: 126.55302,
    latitude: 43.843577,
  },
  {
    name: "四平市",
    longitude: 124.370785,
    latitude: 43.170344,
  },
  {
    name: "辽源市",
    longitude: 125.145349,
    latitude: 42.902692,
  },
  {
    name: "通化市",
    longitude: 125.936501,
    latitude: 41.721177,
  },
  {
    name: "白山市",
    longitude: 126.427839,
    latitude: 41.942505,
  },
  {
    name: "松原市",
    longitude: 124.823608,
    latitude: 45.118243,
  },
  {
    name: "白城市",
    longitude: 122.841114,
    latitude: 45.619026,
  },
  {
    name: "延边朝鲜族自治州",
    longitude: 129.513228,
    latitude: 42.904823,
  },
  {
    name: "哈尔滨市",
    longitude: 126.642464,
    latitude: 45.756967,
  },
  {
    name: "齐齐哈尔市",
    longitude: 123.95792,
    latitude: 47.342081,
  },
  {
    name: "鸡西市",
    longitude: 130.975966,
    latitude: 45.300046,
  },
  {
    name: "鹤岗市",
    longitude: 130.277487,
    latitude: 47.332085,
  },
  {
    name: "双鸭山市",
    longitude: 131.157304,
    latitude: 46.643442,
  },
  {
    name: "大庆市",
    longitude: 125.11272,
    latitude: 46.590734,
  },
  {
    name: "伊春市",
    longitude: 128.899396,
    latitude: 47.724775,
  },
  {
    name: "佳木斯市",
    longitude: 130.361634,
    latitude: 46.809606,
  },
  {
    name: "七台河市",
    longitude: 131.015584,
    latitude: 45.771266,
  },
  {
    name: "牡丹江市",
    longitude: 129.618602,
    latitude: 44.582962,
  },
  {
    name: "黑河市",
    longitude: 127.499023,
    latitude: 50.249585,
  },
  {
    name: "绥化市",
    longitude: 126.99293,
    latitude: 46.637393,
  },
  {
    name: "大兴安岭地区",
    longitude: 124.711526,
    latitude: 52.335262,
  },
  {
    name: "上海市",
    longitude: 121.472644,
    latitude: 31.231706,
  },
  {
    name: "南京市",
    longitude: 118.767413,
    latitude: 32.041544,
  },
  {
    name: "无锡市",
    longitude: 120.301663,
    latitude: 31.574729,
  },
  {
    name: "徐州市",
    longitude: 117.184811,
    latitude: 34.261792,
  },
  {
    name: "常州市",
    longitude: 119.946973,
    latitude: 31.772752,
  },
  {
    name: "苏州市",
    longitude: 120.619585,
    latitude: 31.299379,
  },
  {
    name: "南通市",
    longitude: 120.864608,
    latitude: 32.016212,
  },
  {
    name: "连云港市",
    longitude: 119.178821,
    latitude: 34.600018,
  },
  {
    name: "淮安市",
    longitude: 119.021265,
    latitude: 33.597506,
  },
  {
    name: "盐城市",
    longitude: 120.139998,
    latitude: 33.377631,
  },
  {
    name: "扬州市",
    longitude: 119.421003,
    latitude: 32.393159,
  },
  {
    name: "镇江市",
    longitude: 119.452753,
    latitude: 32.204402,
  },
  {
    name: "泰州市",
    longitude: 119.915176,
    latitude: 32.484882,
  },
  {
    name: "宿迁市",
    longitude: 118.275162,
    latitude: 33.963008,
  },
  {
    name: "杭州市",
    longitude: 120.153576,
    latitude: 30.287459,
  },
  {
    name: "宁波市",
    longitude: 121.549792,
    latitude: 29.868388,
  },
  {
    name: "温州市",
    longitude: 120.672111,
    latitude: 28.000575,
  },
  {
    name: "嘉兴市",
    longitude: 120.750865,
    latitude: 30.762653,
  },
  {
    name: "湖州市",
    longitude: 120.102398,
    latitude: 30.867198,
  },
  {
    name: "绍兴市",
    longitude: 120.582112,
    latitude: 29.997117,
  },
  {
    name: "金华市",
    longitude: 119.649506,
    latitude: 29.089524,
  },
  {
    name: "衢州市",
    longitude: 118.87263,
    latitude: 28.941708,
  },
  {
    name: "舟山市",
    longitude: 122.106863,
    latitude: 30.016028,
  },
  {
    name: "台州市",
    longitude: 121.428599,
    latitude: 28.661378,
  },
  {
    name: "丽水市",
    longitude: 119.921786,
    latitude: 28.451993,
  },
  {
    name: "合肥市",
    longitude: 117.283042,
    latitude: 31.86119,
  },
  {
    name: "芜湖市",
    longitude: 118.376451,
    latitude: 31.326319,
  },
  {
    name: "蚌埠市",
    longitude: 117.363228,
    latitude: 32.939667,
  },
  {
    name: "淮南市",
    longitude: 117.018329,
    latitude: 32.647574,
  },
  {
    name: "马鞍山市",
    longitude: 118.507906,
    latitude: 31.689362,
  },
  {
    name: "淮北市",
    longitude: 116.794664,
    latitude: 33.971707,
  },
  {
    name: "铜陵市",
    longitude: 117.816576,
    latitude: 30.929935,
  },
  {
    name: "安庆市",
    longitude: 117.043551,
    latitude: 30.50883,
  },
  {
    name: "黄山市",
    longitude: 118.317325,
    latitude: 29.709239,
  },
  {
    name: "滁州市",
    longitude: 118.316264,
    latitude: 32.303627,
  },
  {
    name: "阜阳市",
    longitude: 115.819729,
    latitude: 32.896969,
  },
  {
    name: "宿州市",
    longitude: 116.984084,
    latitude: 33.633891,
  },
  {
    name: "六安市",
    longitude: 116.507676,
    latitude: 31.752889,
  },
  {
    name: "亳州市",
    longitude: 115.782939,
    latitude: 33.869338,
  },
  {
    name: "池州市",
    longitude: 117.489157,
    latitude: 30.656037,
  },
  {
    name: "宣城市",
    longitude: 118.757995,
    latitude: 30.945667,
  },
  {
    name: "福州市",
    longitude: 119.306239,
    latitude: 26.075302,
  },
  {
    name: "厦门市",
    longitude: 118.11022,
    latitude: 24.490474,
  },
  {
    name: "莆田市",
    longitude: 119.007558,
    latitude: 25.431011,
  },
  {
    name: "三明市",
    longitude: 117.635001,
    latitude: 26.265444,
  },
  {
    name: "泉州市",
    longitude: 118.589421,
    latitude: 24.908853,
  },
  {
    name: "漳州市",
    longitude: 117.661801,
    latitude: 24.510897,
  },
  {
    name: "南平市",
    longitude: 118.178459,
    latitude: 26.635627,
  },
  {
    name: "龙岩市",
    longitude: 117.02978,
    latitude: 25.091603,
  },
  {
    name: "宁德市",
    longitude: 119.527082,
    latitude: 26.65924,
  },
  {
    name: "南昌市",
    longitude: 115.892151,
    latitude: 28.676493,
  },
  {
    name: "景德镇市",
    longitude: 117.214664,
    latitude: 29.29256,
  },
  {
    name: "萍乡市",
    longitude: 113.852186,
    latitude: 27.622946,
  },
  {
    name: "九江市",
    longitude: 115.992811,
    latitude: 29.712034,
  },
  {
    name: "新余市",
    longitude: 114.930835,
    latitude: 27.810834,
  },
  {
    name: "鹰潭市",
    longitude: 117.033838,
    latitude: 28.238638,
  },
  {
    name: "赣州市",
    longitude: 114.940278,
    latitude: 25.85097,
  },
  {
    name: "吉安市",
    longitude: 114.986373,
    latitude: 27.111699,
  },
  {
    name: "宜春市",
    longitude: 114.391136,
    latitude: 27.8043,
  },
  {
    name: "抚州市",
    longitude: 116.358351,
    latitude: 27.98385,
  },
  {
    name: "上饶市",
    longitude: 117.971185,
    latitude: 28.44442,
  },
  {
    name: "济南市",
    longitude: 117.000923,
    latitude: 36.675807,
  },
  {
    name: "青岛市",
    longitude: 120.355173,
    latitude: 36.082982,
  },
  {
    name: "淄博市",
    longitude: 118.047648,
    latitude: 36.814939,
  },
  {
    name: "枣庄市",
    longitude: 117.557964,
    latitude: 34.856424,
  },
  {
    name: "东营市",
    longitude: 118.66471,
    latitude: 37.434564,
  },
  {
    name: "烟台市",
    longitude: 121.391382,
    latitude: 37.539297,
  },
  {
    name: "潍坊市",
    longitude: 119.107078,
    latitude: 36.70925,
  },
  {
    name: "济宁市",
    longitude: 116.587245,
    latitude: 35.415393,
  },
  {
    name: "泰安市",
    longitude: 117.129063,
    latitude: 36.194968,
  },
  {
    name: "威海市",
    longitude: 122.116394,
    latitude: 37.509691,
  },
  {
    name: "日照市",
    longitude: 119.461208,
    latitude: 35.428588,
  },
  {
    name: "临沂市",
    longitude: 118.326443,
    latitude: 35.065282,
  },
  {
    name: "德州市",
    longitude: 116.307428,
    latitude: 37.453968,
  },
  {
    name: "聊城市",
    longitude: 115.980367,
    latitude: 36.456013,
  },
  {
    name: "滨州市",
    longitude: 118.016974,
    latitude: 37.383542,
  },
  {
    name: "菏泽市",
    longitude: 115.469381,
    latitude: 35.246531,
  },
  {
    name: "郑州市",
    longitude: 113.665412,
    latitude: 34.757975,
  },
  {
    name: "开封市",
    longitude: 114.341447,
    latitude: 34.797049,
  },
  {
    name: "洛阳市",
    longitude: 112.434468,
    latitude: 34.663041,
  },
  {
    name: "平顶山市",
    longitude: 113.307718,
    latitude: 33.735241,
  },
  {
    name: "安阳市",
    longitude: 114.352482,
    latitude: 36.103442,
  },
  {
    name: "鹤壁市",
    longitude: 114.295444,
    latitude: 35.748236,
  },
  {
    name: "新乡市",
    longitude: 113.883991,
    latitude: 35.302616,
  },
  {
    name: "焦作市",
    longitude: 113.238266,
    latitude: 35.23904,
  },
  {
    name: "濮阳市",
    longitude: 115.041299,
    latitude: 35.768234,
  },
  {
    name: "许昌市",
    longitude: 113.826063,
    latitude: 34.022956,
  },
  {
    name: "漯河市",
    longitude: 114.026405,
    latitude: 33.575855,
  },
  {
    name: "三门峡市",
    longitude: 111.194099,
    latitude: 34.777338,
  },
  {
    name: "南阳市",
    longitude: 112.540918,
    latitude: 32.999082,
  },
  {
    name: "商丘市",
    longitude: 115.650497,
    latitude: 34.437054,
  },
  {
    name: "信阳市",
    longitude: 114.075031,
    latitude: 32.123274,
  },
  {
    name: "周口市",
    longitude: 114.649653,
    latitude: 33.620357,
  },
  {
    name: "驻马店市",
    longitude: 114.024736,
    latitude: 32.980169,
  },
  {
    name: "济源市",
    longitude: 112.590047,
    latitude: 35.090378,
  },
  {
    name: "武汉市",
    longitude: 114.298572,
    latitude: 30.584355,
  },
  {
    name: "黄石市",
    longitude: 115.077048,
    latitude: 30.220074,
  },
  {
    name: "十堰市",
    longitude: 110.787916,
    latitude: 32.646907,
  },
  {
    name: "宜昌市",
    longitude: 111.290843,
    latitude: 30.702636,
  },
  {
    name: "襄阳市",
    longitude: 112.144146,
    latitude: 32.042426,
  },
  {
    name: "鄂州市",
    longitude: 114.890593,
    latitude: 30.396536,
  },
  {
    name: "荆门市",
    longitude: 112.204251,
    latitude: 31.03542,
  },
  {
    name: "孝感市",
    longitude: 113.926655,
    latitude: 30.926423,
  },
  {
    name: "荆州市",
    longitude: 112.23813,
    latitude: 30.326857,
  },
  {
    name: "黄冈市",
    longitude: 114.879365,
    latitude: 30.447711,
  },
  {
    name: "咸宁市",
    longitude: 114.328963,
    latitude: 29.832798,
  },
  {
    name: "随州市",
    longitude: 113.37377,
    latitude: 31.717497,
  },
  {
    name: "恩施土家族苗族自治州",
    longitude: 109.48699,
    latitude: 30.283114,
  },
  {
    name: "仙桃市",
    longitude: 113.453974,
    latitude: 30.364953,
  },
  {
    name: "潜江市",
    longitude: 112.896866,
    latitude: 30.421215,
  },
  {
    name: "天门市",
    longitude: 113.165862,
    latitude: 30.653061,
  },
  {
    name: "神农架林区",
    longitude: 110.671525,
    latitude: 31.744449,
  },
  {
    name: "长沙市",
    longitude: 112.982279,
    latitude: 28.19409,
  },
  {
    name: "株洲市",
    longitude: 113.151737,
    latitude: 27.835806,
  },
  {
    name: "湘潭市",
    longitude: 112.944052,
    latitude: 27.82973,
  },
  {
    name: "衡阳市",
    longitude: 112.607693,
    latitude: 26.900358,
  },
  {
    name: "邵阳市",
    longitude: 111.46923,
    latitude: 27.237842,
  },
  {
    name: "岳阳市",
    longitude: 113.132855,
    latitude: 29.37029,
  },
  {
    name: "常德市",
    longitude: 111.691347,
    latitude: 29.040225,
  },
  {
    name: "张家界市",
    longitude: 110.479921,
    latitude: 29.127401,
  },
  {
    name: "益阳市",
    longitude: 112.355042,
    latitude: 28.570066,
  },
  {
    name: "郴州市",
    longitude: 113.032067,
    latitude: 25.793589,
  },
  {
    name: "永州市",
    longitude: 111.608019,
    latitude: 26.434516,
  },
  {
    name: "怀化市",
    longitude: 109.97824,
    latitude: 27.550082,
  },
  {
    name: "娄底市",
    longitude: 112.008497,
    latitude: 27.728136,
  },
  {
    name: "湘西土家族苗族自治州",
    longitude: 109.739735,
    latitude: 28.314296,
  },
  {
    name: "广州市",
    longitude: 113.280637,
    latitude: 23.125178,
  },
  {
    name: "韶关市",
    longitude: 113.591544,
    latitude: 24.801322,
  },
  {
    name: "深圳市",
    longitude: 114.085947,
    latitude: 22.547,
  },
  {
    name: "珠海市",
    longitude: 113.553986,
    latitude: 22.224979,
  },
  {
    name: "汕头市",
    longitude: 116.708463,
    latitude: 23.37102,
  },
  {
    name: "佛山市",
    longitude: 113.122717,
    latitude: 23.028762,
  },
  {
    name: "江门市",
    longitude: 113.094942,
    latitude: 22.590431,
  },
  {
    name: "湛江市",
    longitude: 110.364977,
    latitude: 21.274898,
  },
  {
    name: "茂名市",
    longitude: 110.919229,
    latitude: 21.659751,
  },
  {
    name: "肇庆市",
    longitude: 112.472529,
    latitude: 23.051546,
  },
  {
    name: "惠州市",
    longitude: 114.412599,
    latitude: 23.079404,
  },
  {
    name: "梅州市",
    longitude: 116.117582,
    latitude: 24.299112,
  },
  {
    name: "汕尾市",
    longitude: 115.364238,
    latitude: 22.774485,
  },
  {
    name: "河源市",
    longitude: 114.697802,
    latitude: 23.746266,
  },
  {
    name: "阳江市",
    longitude: 111.975107,
    latitude: 21.859222,
  },
  {
    name: "清远市",
    longitude: 113.051227,
    latitude: 23.685022,
  },
  {
    name: "东莞市",
    longitude: 113.746262,
    latitude: 23.046237,
  },
  {
    name: "中山市",
    longitude: 113.382391,
    latitude: 22.521113,
  },
  {
    name: "潮州市",
    longitude: 116.632301,
    latitude: 23.661701,
  },
  {
    name: "揭阳市",
    longitude: 116.355733,
    latitude: 23.543778,
  },
  {
    name: "云浮市",
    longitude: 112.044439,
    latitude: 22.929801,
  },
  {
    name: "南宁市",
    longitude: 108.320004,
    latitude: 22.82402,
  },
  {
    name: "柳州市",
    longitude: 109.411703,
    latitude: 24.314617,
  },
  {
    name: "桂林市",
    longitude: 110.299121,
    latitude: 25.274215,
  },
  {
    name: "梧州市",
    longitude: 111.297604,
    latitude: 23.474803,
  },
  {
    name: "北海市",
    longitude: 109.119254,
    latitude: 21.473343,
  },
  {
    name: "防城港市",
    longitude: 108.345478,
    latitude: 21.614631,
  },
  {
    name: "钦州市",
    longitude: 108.624175,
    latitude: 21.967127,
  },
  {
    name: "贵港市",
    longitude: 109.602146,
    latitude: 23.0936,
  },
  {
    name: "玉林市",
    longitude: 110.154393,
    latitude: 22.63136,
  },
  {
    name: "百色市",
    longitude: 106.616285,
    latitude: 23.897742,
  },
  {
    name: "贺州市",
    longitude: 111.552056,
    latitude: 24.414141,
  },
  {
    name: "河池市",
    longitude: 108.062105,
    latitude: 24.695899,
  },
  {
    name: "来宾市",
    longitude: 109.229772,
    latitude: 23.733766,
  },
  {
    name: "崇左市",
    longitude: 107.353926,
    latitude: 22.404108,
  },
  {
    name: "海口市",
    longitude: 110.33119,
    latitude: 20.031971,
  },
  {
    name: "三亚市",
    longitude: 109.508268,
    latitude: 18.247872,
  },
  {
    name: "三沙市",
    longitude: 112.34882,
    latitude: 16.831039,
  },
  {
    name: "儋州市",
    longitude: 109.576782,
    latitude: 19.517486,
  },
  {
    name: "五指山市",
    longitude: 109.516662,
    latitude: 18.776921,
  },
  {
    name: "琼海市",
    longitude: 110.466785,
    latitude: 19.246011,
  },
  {
    name: "文昌市",
    longitude: 110.753975,
    latitude: 19.612986,
  },
  {
    name: "万宁市",
    longitude: 110.388793,
    latitude: 18.796216,
  },
  {
    name: "东方市",
    longitude: 108.653789,
    latitude: 19.10198,
  },
  {
    name: "定安县",
    longitude: 110.349235,
    latitude: 19.684966,
  },
  {
    name: "屯昌县",
    longitude: 110.102773,
    latitude: 19.362916,
  },
  {
    name: "澄迈县",
    longitude: 110.007147,
    latitude: 19.737095,
  },
  {
    name: "临高县",
    longitude: 109.687697,
    latitude: 19.908293,
  },
  {
    name: "白沙黎族自治县",
    longitude: 109.452606,
    latitude: 19.224584,
  },
  {
    name: "昌江黎族自治县",
    longitude: 109.053351,
    latitude: 19.260968,
  },
  {
    name: "乐东黎族自治县",
    longitude: 109.175444,
    latitude: 18.74758,
  },
  {
    name: "陵水黎族自治县",
    longitude: 110.037218,
    latitude: 18.505006,
  },
  {
    name: "保亭黎族苗族自治县",
    longitude: 109.70245,
    latitude: 18.636371,
  },
  {
    name: "琼中黎族苗族自治县",
    longitude: 109.839996,
    latitude: 19.03557,
  },
  {
    name: "重庆市",
    longitude: 106.504962,
    latitude: 29.533155,
  },
  {
    name: "成都市",
    longitude: 104.065735,
    latitude: 30.659462,
  },
  {
    name: "自贡市",
    longitude: 104.773447,
    latitude: 29.352765,
  },
  {
    name: "攀枝花市",
    longitude: 101.716007,
    latitude: 26.580446,
  },
  {
    name: "泸州市",
    longitude: 105.443348,
    latitude: 28.889138,
  },
  {
    name: "德阳市",
    longitude: 104.398651,
    latitude: 31.127991,
  },
  {
    name: "绵阳市",
    longitude: 104.741722,
    latitude: 31.46402,
  },
  {
    name: "广元市",
    longitude: 105.829757,
    latitude: 32.433668,
  },
  {
    name: "遂宁市",
    longitude: 105.571331,
    latitude: 30.513311,
  },
  {
    name: "内江市",
    longitude: 105.066138,
    latitude: 29.58708,
  },
  {
    name: "乐山市",
    longitude: 103.761263,
    latitude: 29.582024,
  },
  {
    name: "南充市",
    longitude: 106.082974,
    latitude: 30.795281,
  },
  {
    name: "眉山市",
    longitude: 103.831788,
    latitude: 30.048318,
  },
  {
    name: "宜宾市",
    longitude: 104.630825,
    latitude: 28.760189,
  },
  {
    name: "广安市",
    longitude: 106.633369,
    latitude: 30.456398,
  },
  {
    name: "达州市",
    longitude: 107.502262,
    latitude: 31.209484,
  },
  {
    name: "雅安市",
    longitude: 103.001033,
    latitude: 29.987722,
  },
  {
    name: "巴中市",
    longitude: 106.753669,
    latitude: 31.858809,
  },
  {
    name: "资阳市",
    longitude: 104.641917,
    latitude: 30.122211,
  },
  {
    name: "阿坝藏族羌族自治州",
    longitude: 102.221374,
    latitude: 31.899792,
  },
  {
    name: "甘孜藏族自治州",
    longitude: 101.963815,
    latitude: 30.050663,
  },
  {
    name: "凉山彝族自治州",
    longitude: 102.258746,
    latitude: 27.886762,
  },
  {
    name: "贵阳市",
    longitude: 106.713478,
    latitude: 26.578343,
  },
  {
    name: "六盘水市",
    longitude: 104.846743,
    latitude: 26.584643,
  },
  {
    name: "遵义市",
    longitude: 106.937265,
    latitude: 27.706626,
  },
  {
    name: "安顺市",
    longitude: 105.932188,
    latitude: 26.245544,
  },
  {
    name: "毕节市",
    longitude: 105.28501,
    latitude: 27.301693,
  },
  {
    name: "铜仁市",
    longitude: 109.191555,
    latitude: 27.718346,
  },
  {
    name: "黔西南布依族苗族自治州",
    longitude: 104.897971,
    latitude: 25.08812,
  },
  {
    name: "黔东南苗族侗族自治州",
    longitude: 107.977488,
    latitude: 26.583352,
  },
  {
    name: "黔南布依族苗族自治州",
    longitude: 107.517156,
    latitude: 26.258219,
  },
  {
    name: "昆明市",
    longitude: 102.712251,
    latitude: 25.040609,
  },
  {
    name: "曲靖市",
    longitude: 103.797851,
    latitude: 25.501557,
  },
  {
    name: "玉溪市",
    longitude: 102.543907,
    latitude: 24.350461,
  },
  {
    name: "保山市",
    longitude: 99.167133,
    latitude: 25.111802,
  },
  {
    name: "昭通市",
    longitude: 103.717216,
    latitude: 27.336999,
  },
  {
    name: "丽江市",
    longitude: 100.233026,
    latitude: 26.872108,
  },
  {
    name: "普洱市",
    longitude: 100.972344,
    latitude: 22.777321,
  },
  {
    name: "临沧市",
    longitude: 100.08697,
    latitude: 23.886567,
  },
  {
    name: "楚雄彝族自治州",
    longitude: 101.546046,
    latitude: 25.041988,
  },
  {
    name: "红河哈尼族彝族自治州",
    longitude: 103.384182,
    latitude: 23.366775,
  },
  {
    name: "文山壮族苗族自治州",
    longitude: 104.24401,
    latitude: 23.36951,
  },
  {
    name: "西双版纳傣族自治州",
    longitude: 100.797941,
    latitude: 22.001724,
  },
  {
    name: "大理白族自治州",
    longitude: 100.225668,
    latitude: 25.589449,
  },
  {
    name: "德宏傣族景颇族自治州",
    longitude: 98.578363,
    latitude: 24.436694,
  },
  {
    name: "怒江傈僳族自治州",
    longitude: 98.854304,
    latitude: 25.850949,
  },
  {
    name: "迪庆藏族自治州",
    longitude: 99.706463,
    latitude: 27.826853,
  },
  {
    name: "拉萨市",
    longitude: 91.132212,
    latitude: 29.660361,
  },
  {
    name: "日喀则市",
    longitude: 88.885148,
    latitude: 29.267519,
  },
  {
    name: "昌都市",
    longitude: 97.178452,
    latitude: 31.136875,
  },
  {
    name: "林芝市",
    longitude: 94.362348,
    latitude: 29.654693,
  },
  {
    name: "山南市",
    longitude: 91.766529,
    latitude: 29.236023,
  },
  {
    name: "那曲市",
    longitude: 92.060214,
    latitude: 31.476004,
  },
  {
    name: "阿里地区",
    longitude: 80.105498,
    latitude: 32.503187,
  },
  {
    name: "西安市",
    longitude: 108.948024,
    latitude: 34.263161,
  },
  {
    name: "铜川市",
    longitude: 108.979608,
    latitude: 34.916582,
  },
  {
    name: "宝鸡市",
    longitude: 107.14487,
    latitude: 34.369315,
  },
  {
    name: "咸阳市",
    longitude: 108.705117,
    latitude: 34.333439,
  },
  {
    name: "渭南市",
    longitude: 109.502882,
    latitude: 34.499381,
  },
  {
    name: "延安市",
    longitude: 109.49081,
    latitude: 36.596537,
  },
  {
    name: "汉中市",
    longitude: 107.028621,
    latitude: 33.077668,
  },
  {
    name: "榆林市",
    longitude: 109.741193,
    latitude: 38.290162,
  },
  {
    name: "安康市",
    longitude: 109.029273,
    latitude: 32.6903,
  },
  {
    name: "商洛市",
    longitude: 109.939776,
    latitude: 33.868319,
  },
  {
    name: "兰州市",
    longitude: 103.823557,
    latitude: 36.058039,
  },
  {
    name: "嘉峪关市",
    longitude: 98.277304,
    latitude: 39.786529,
  },
  {
    name: "金昌市",
    longitude: 102.187888,
    latitude: 38.514238,
  },
  {
    name: "白银市",
    longitude: 104.173606,
    latitude: 36.54568,
  },
  {
    name: "天水市",
    longitude: 105.724998,
    latitude: 34.578529,
  },
  {
    name: "武威市",
    longitude: 102.634697,
    latitude: 37.929996,
  },
  {
    name: "张掖市",
    longitude: 100.455472,
    latitude: 38.932897,
  },
  {
    name: "平凉市",
    longitude: 106.684691,
    latitude: 35.54279,
  },
  {
    name: "酒泉市",
    longitude: 98.510795,
    latitude: 39.744023,
  },
  {
    name: "庆阳市",
    longitude: 107.638372,
    latitude: 35.734218,
  },
  {
    name: "定西市",
    longitude: 104.626294,
    latitude: 35.579578,
  },
  {
    name: "陇南市",
    longitude: 104.929379,
    latitude: 33.388598,
  },
  {
    name: "临夏回族自治州",
    longitude: 103.212006,
    latitude: 35.599446,
  },
  {
    name: "甘南藏族自治州",
    longitude: 102.911008,
    latitude: 34.986354,
  },
  {
    name: "西宁市",
    longitude: 101.778916,
    latitude: 36.623178,
  },
  {
    name: "海东市",
    longitude: 102.10327,
    latitude: 36.502916,
  },
  {
    name: "海北藏族自治州",
    longitude: 100.901059,
    latitude: 36.959435,
  },
  {
    name: "黄南藏族自治州",
    longitude: 102.019988,
    latitude: 35.517744,
  },
  {
    name: "海南藏族自治州",
    longitude: 100.619542,
    latitude: 36.280353,
  },
  {
    name: "果洛藏族自治州",
    longitude: 100.242143,
    latitude: 34.4736,
  },
  {
    name: "玉树藏族自治州",
    longitude: 97.008522,
    latitude: 33.004049,
  },
  {
    name: "海西蒙古族藏族自治州",
    longitude: 97.370785,
    latitude: 37.374663,
  },
  {
    name: "银川市",
    longitude: 106.278179,
    latitude: 38.46637,
  },
  {
    name: "石嘴山市",
    longitude: 106.376173,
    latitude: 39.01333,
  },
  {
    name: "吴忠市",
    longitude: 106.199409,
    latitude: 37.986165,
  },
  {
    name: "固原市",
    longitude: 106.285241,
    latitude: 36.004561,
  },
  {
    name: "中卫市",
    longitude: 105.189568,
    latitude: 37.514951,
  },
  {
    name: "乌鲁木齐市",
    longitude: 87.617733,
    latitude: 43.792818,
  },
  {
    name: "克拉玛依市",
    longitude: 84.873946,
    latitude: 45.595886,
  },
  {
    name: "吐鲁番市",
    longitude: 89.184078,
    latitude: 42.947613,
  },
  {
    name: "哈密市",
    longitude: 93.51316,
    latitude: 42.833248,
  },
  {
    name: "昌吉回族自治州",
    longitude: 87.304012,
    latitude: 44.014577,
  },
  {
    name: "博尔塔拉蒙古自治州",
    longitude: 82.074778,
    latitude: 44.903258,
  },
  {
    name: "巴音郭楞蒙古自治州",
    longitude: 86.150969,
    latitude: 41.768552,
  },
  {
    name: "阿克苏地区",
    longitude: 80.265068,
    latitude: 41.170712,
  },
  {
    name: "克孜勒苏柯尔克孜自治州",
    longitude: 76.172825,
    latitude: 39.713431,
  },
  {
    name: "喀什地区",
    longitude: 75.989138,
    latitude: 39.467664,
  },
  {
    name: "和田地区",
    longitude: 79.92533,
    latitude: 37.110687,
  },
  {
    name: "伊犁哈萨克自治州",
    longitude: 81.317946,
    latitude: 43.92186,
  },
  {
    name: "塔城地区",
    longitude: 82.985732,
    latitude: 46.746301,
  },
  {
    name: "阿勒泰地区",
    longitude: 88.13963,
    latitude: 47.848393,
  },
  {
    name: "石河子市",
    longitude: 86.041075,
    latitude: 44.305886,
  },
  {
    name: "阿拉尔市",
    longitude: 81.285884,
    latitude: 40.541914,
  },
  {
    name: "图木舒克市",
    longitude: 79.077978,
    latitude: 39.867316,
  },
  {
    name: "五家渠市",
    longitude: 87.526884,
    latitude: 44.167401,
  },
  {
    name: "北屯市",
    longitude: 87.824932,
    latitude: 47.353177,
  },
  {
    name: "铁门关市",
    longitude: 85.501218,
    latitude: 41.827251,
  },
  {
    name: "双河市",
    longitude: 82.353656,
    latitude: 44.840524,
  },
  {
    name: "可克达拉市",
    longitude: 80.63579,
    latitude: 43.6832,
  },
  {
    name: "昆玉市",
    longitude: 79.287372,
    latitude: 37.207994,
  },
  {
    name: "胡杨河市",
    longitude: 84.8275959,
    latitude: 44.69288853,
  },
  {
    name: "台湾省",
    longitude: 121.509062,
    latitude: 25.044332,
  },
  {
    name: "香港特别行政区",
    longitude: 114.173355,
    latitude: 22.320048,
  },
  {
    name: "香港",
    longitude: 114.173355,
    latitude: 22.320048,
  },
  {
    name: "澳门特别行政区",
    longitude: 113.54909,
    latitude: 22.198951,
  },
  {
    name: "澳门",
    longitude: 113.54909,
    latitude: 22.198951,
  },
];

export const getCenterByCity = (city: string) => {
  const index = cityMap.findIndex(x => {
    return (
      x.name === city ||
      x.name === `${city}市` ||
      pinyin(x.name.split("市")[0], {
        toneType: "none",
        type: "array",
      }).join("") === city.toLowerCase()
    );
  });
  if (index > -1) {
    return [cityMap[index].longitude, cityMap[index].latitude];
  } else {
    return false;
  }
};
