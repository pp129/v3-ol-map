import { defineComponent, inject, onMounted, PropType, Ref, unref, watch, ref } from "vue";
import GeoJSON from "ol/format/GeoJSON.js";
import { Heatmap } from "ol/layer.js";
import Cluster from "ol/source/Cluster.js";
import Supercluster from "supercluster";
import type { ReadOptions } from "ol/format/Feature";
import type VectorSource from "ol/source/Vector";
import Feature from "ol/Feature.js";
import type VectorLayer from "ol/layer/Vector";
import { Projection } from "ol/proj.js";
import {
  Circle,
  Geometry,
  GeometryCollection,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "ol/geom.js";
import { Type } from "ol/geom/Geometry";
import type { BBox, GeoJSON as TypeGeoJSON } from "geojson";
import OlMap from "../lib/index.ts";
import {
  FeatureGeometry,
  GeoCircle,
  GeoGeometryCollection,
  GeoJsonReadOptions,
  GeoLinearRing,
  GeoLineString,
  GeoMultiLineString,
  GeoMultiPoint,
  GeoMultiPolygon,
  GeoPoint,
  GeoPolygon,
} from "../types";
import { ExposeFeature } from "../types";
import { setFeatureStyle } from "../utils/style.ts";

const OlFeature = defineComponent({
  name: "OlFeature",
  props: {
    geometries: {
      type: Array as PropType<FeatureGeometry[]> | undefined,
      default: undefined,
    },
    geoJson: {
      type: Object as PropType<TypeGeoJSON> | undefined,
      default: undefined,
    },
    options: {
      type: Object as PropType<GeoJsonReadOptions> | undefined,
      default: undefined,
    },
  },
  setup(props, { expose }) {
    const VMap = inject("VMap") as OlMap;
    const map = unref(VMap).map;
    const layer = inject("ParentLayer") as Ref<VectorLayer | Heatmap>;
    let clusters: Supercluster;
    let sourceFeatures = ref<Feature[]>();

    // 添加feature
    const addFeatures = () => {
      console.log("addFeatures", layer.value);
      let source = layer.value.getSource();
      if (layer.value.get("cluster")) {
        // 如果是聚合图层，获取聚合图层的source
        if (layer.value.getSource()) source = (layer.value.getSource() as Cluster<Feature>).getSource();
      }
      if (source) {
        // source.clear();
        const superCluster = layer.value.get("superCluster");
        if (superCluster) {
          clusters = new Supercluster(superCluster);
          let features: Feature[] = [];
          if (props.geoJson) {
            features.push(...getFeaturesByGeoJson("Point"));
          }
          if (props.geometries && props.geometries.length > 0) {
            features.push(...getFeaturesByGeometries("Point"));
          }
          const geoFeatures = new GeoJSON().writeFeaturesObject(features);
          clusters.load(geoFeatures.features as Array<Supercluster.PointFeature<Supercluster.AnyProps>>);
          const extent = map.getView().calculateExtent(map.getSize());
          const clusterFeatures = clusters.getClusters(extent as BBox, map.getView().getZoom() || 0);
          const olFeatures = new GeoJSON()
            .readFeatures({
              type: "FeatureCollection",
              features: clusterFeatures,
            })
            .map(feature => {
              const properties = feature.get("properties");
              if (properties && typeof properties === "object") {
                for (const i in properties) {
                  if (Object.prototype.hasOwnProperty.call(properties, i)) {
                    feature.set(i, properties[i]);
                  }
                }
              }
              return feature;
            });
          source.addFeatures(olFeatures);

          map.on("precompose", () => {
            // this.$emit('changeresolution')
            const extent = map.getView().calculateExtent(map.getSize());
            const cluster = clusters.getClusters(extent as BBox, map.getView().getZoom() || 0);
            const features = {
              type: "FeatureCollection",
              features: cluster,
            };
            const source = layer.value.getSource();
            if (source) {
              source.clear();
              source.addFeatures(
                new GeoJSON().readFeatures(features).map(feature => {
                  const properties = feature.get("properties");
                  if (properties && typeof properties === "object") {
                    for (const i in properties) {
                      if (Object.prototype.hasOwnProperty.call(properties, i)) {
                        feature.set(i, properties[i]);
                      }
                    }
                  }
                  const style = feature.get("style");
                  if (style) {
                    setFeatureStyle(feature, style, map);
                  }
                  return feature;
                }),
              );
            }
          });
          // console.log(this.clusters);
        } else {
          if (props.geoJson) {
            addFeaturesByGeoJson(source, layer.value.get("cluster") ? "Point" : undefined);
          }
          if (props.geometries && props.geometries.length > 0) {
            addFeaturesByGeometries(source, layer.value.get("cluster") ? "Point" : undefined);
          }
        }
      }
    };
    // 根据geojson添加feature
    const addFeaturesByGeoJson = (source: VectorSource, onlyType?: Type) => {
      const features = getFeaturesByGeoJson(onlyType);
      // console.log(features);
      console.log(source);
      if (features && features.length > 0) {
        sourceFeatures.value = features;
        source.addFeatures(features);
      }
    };

    const getFeaturesByGeoJson = (onlyType?: Type) => {
      let dataProjection: ReadOptions["dataProjection"] | undefined;
      let featureProjection: ReadOptions["featureProjection"] | undefined;
      let extent: Array<number> | undefined;
      const geojson = onlyType ? specifyTypeGeojson(onlyType) : props.geoJson;
      const options = props.options;
      if (options && options.dataProjection) {
        dataProjection = new Projection(options.dataProjection);
      }
      if (options && options.featureProjection) {
        featureProjection = new Projection(options.featureProjection);
      }
      if (options && options.extent) {
        extent = options.extent;
      }
      const features: Feature[] = new GeoJSON()
        .readFeatures(geojson, options ? { extent, dataProjection, featureProjection } : undefined)
        .map(feature => {
          const style = feature.get("style");
          const id = feature.get("id");
          if (style) {
            setFeatureStyle(feature, style, map);
          }
          if (id && !feature.getId()) feature.setId(id);
          return feature;
        });
      return features;
    };

    const specifyTypeGeojson = (type: Type) => {
      const geojson = props.geoJson;
      if (!geojson) return;
      if (geojson.type === "FeatureCollection") {
        return {
          type: "FeatureCollection",
          features: geojson.features.filter(feature => feature.geometry.type === type),
        };
      } else if (geojson.type === "Feature") {
        return geojson.geometry.type === type ? geojson : null;
      } else {
        return geojson.type === type ? geojson : null;
      }
    };
    const getRadiusByUnit = (radius: number | undefined): number => {
      const metersPerUnit = map.getView().getProjection().getMetersPerUnit();
      if (radius && metersPerUnit) {
        return radius / metersPerUnit;
      } else {
        return 0;
      }
    };
    // 根据geometryObject添加feature
    const addFeaturesByGeometries = (source: VectorSource, onlyType?: Type) => {
      const features = getFeaturesByGeometries(onlyType);
      if (features && features.length > 0) {
        sourceFeatures.value = features;
        source.addFeatures(features);
      }
    };

    const getGeoByGeometries = (geometry: FeatureGeometry): Geometry | undefined => {
      if (geometry.type === "Point") {
        return new Point((geometry.geometry as GeoPoint).coordinates);
      } else if (geometry.type === "MultiPoint") {
        return new MultiPoint((geometry.geometry as GeoMultiPoint).coordinates);
      } else if (geometry.type === "Circle") {
        const geom = geometry.geometry as GeoCircle;
        const radius = getRadiusByUnit(geom.radius);
        return new Circle(geom.center, radius);
      } else if (geometry.type === "Polygon") {
        return new Polygon((geometry.geometry as GeoPolygon).coordinates);
      } else if (geometry.type === "LineString") {
        return new LineString((geometry.geometry as GeoLineString).coordinates);
      } else if (geometry.type === "MultiPolygon") {
        return new MultiPolygon((geometry.geometry as GeoMultiPolygon).coordinates);
      } else if (geometry.type === "MultiLineString") {
        return new MultiLineString((geometry.geometry as GeoMultiLineString).coordinates);
      } else if (geometry.type === "LinearRing") {
        return new LinearRing((geometry.geometry as GeoLinearRing).coordinates);
      }
    };

    const getFeaturesByGeometries = (onlyType?: Type): Feature[] => {
      const geometries = props.geometries;
      if (!geometries) return [];
      let features: Feature[] = [];
      geometries.forEach(geometry => {
        if (geometry.type === "GeometryCollection") {
          let collection: Geometry[] = [];
          (geometry.geometry as GeoGeometryCollection).geometries.forEach(geom => {
            const type = onlyType ? onlyType : geometry.type;
            const geo = getGeoByGeometries({
              type,
              geometry: geom,
            });
            if (geo) collection.push(geo);
          });
          const geomCollection = new GeometryCollection(collection);
          features.push(new Feature({ geometry: geomCollection, ...geometry.properties }));
        } else {
          if (onlyType && geometry.type !== onlyType) return;
          const feature = new Feature({ geometry: getGeoByGeometries(geometry), ...geometry.properties });
          features.push(feature);
        }
      });
      return features.map(feature => {
        const style = feature.get("style");
        const id = feature.get("id");
        if (style) {
          setFeatureStyle(feature, style, map);
        }
        if (id && !feature.getId()) feature.setId(id);
        return feature;
      });
    };

    // SuperCluster 获取 聚合点位下的子集
    const getLeaves = (id: number, limit?: number, offset?: number) => {
      if (!clusters) {
        throw new Error("SuperCluster is not initialized");
      } else {
        return clusters.getLeaves(id, limit, offset);
      }
    };

    const resetFeatures = (value: TypeGeoJSON | FeatureGeometry[] | undefined) => {
      if (!layer) return;
      let source = layer.value.getSource();
      if (layer.value.get("cluster")) {
        // 如果是聚合图层，获取聚合图层的source
        if (layer.value.getSource()) source = (layer.value.getSource() as Cluster<Feature>).getSource();
      }
      // if (sourceFeatures.value) {
      //   source?.removeFeatures(sourceFeatures.value ?? []);
      // }
      source?.clear();
      if (!value) return;
      addFeatures();
    };

    // watch(
    //   () => props.geoJson,
    //   value => {
    //     resetFeatures(value);
    //   },
    //   { deep: true },
    // );

    // watch(
    //   () => props.geometries,
    //   value => {
    //     resetFeatures(value);
    //   },
    //   { deep: true },
    // );

    // watchEffect(() => {
    //   resetFeatures(props.geoJson || props.geometries);
    // });

    watch(
      [() => props.geoJson, () => props.geometries],
      ([newFirst, newLast], [oldFirst, oldLast]) => {
        resetFeatures(props.geoJson || props.geometries);
      },
      {
        deep: true,
      },
    );

    onMounted(() => {
      if (layer) {
        resetFeatures(props.geoJson || props.geometries);
      }
    });

    expose({
      getLeaves: getLeaves,
    });

    return <ExposeFeature>{
      getLeaves: getLeaves,
    };
  },
  render() {
    return null;
  },
});

export default OlFeature;
