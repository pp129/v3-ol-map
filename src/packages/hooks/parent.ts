import { ComponentInternalInstance, getCurrentInstance, inject, Ref, unref } from "vue";
import Map from "ol/Map";
import LayerGroup from "ol/layer/Group";
import BaseLayer from "ol/layer/Base";
import Collection from "ol/Collection";
import OlMap from "@/packages/lib";
const useParent = () => {
  const instance = getCurrentInstance();
  const parent: ComponentInternalInstance | null | undefined = instance?.parent;
  const VMap = inject<Ref<OlMap> | undefined>("VMap", undefined);
  const map: Map | undefined = unref(VMap)?.map;
  const injectGroup = inject<Ref<LayerGroup> | undefined>("GroupLayer", undefined);
  const groupLayer = unref(injectGroup);

  const findParent = (parentComp: ComponentInternalInstance | null | undefined): string => {
    // 向上递归查询，直到找到OlMap或OlGroupLayer
    if (parentComp?.type?.name === "OlMap" || parentComp?.type?.name === "OlGroupLayer") {
      return parentComp?.type?.name;
    } else {
      return findParent(parentComp?.parent);
    }
  };

  const addLayer = (layer: BaseLayer) => {
    console.log("parent", parent);
    const parentName = findParent(parent);
    console.log("parentName", parentName);
    if (parentName === "OlMap") {
      try {
        map?.addLayer(layer);
      } catch (e) {
        throw new Error(e?.toString());
      }
    } else if (parentName === "OlGroupLayer") {
      try {
        // 先检查是否已经存在该图层
        const layersInGroup = groupLayer?.getLayersArray().map(l => l.get("id"));
        if (layersInGroup?.includes(layer.get("id"))) {
          return;
        } else {
          const layers = groupLayer?.getLayersArray() || [];
          groupLayer?.setLayers(new Collection([...layers, layer], { unique: true }));
        }
      } catch (e) {
        throw new Error(e?.toString());
      }
    }
  };

  return {
    addLayer,
  };
};

export { useParent };
