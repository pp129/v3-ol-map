import { getCurrentInstance } from "vue";
import Map from "ol/Map";
import Group from "ol/layer/group";
import BaseLayer from "ol/layer/Base";
import Collection from "ol/Collection";

export interface ParentOptionType {
  map?: Map | undefined;
  groupLayer?: Group | undefined;
}
const useParent = (options: ParentOptionType) => {
  const instance = getCurrentInstance();
  const parent = instance?.parent;
  const addLayer = (layer: BaseLayer) => {
    if (parent?.type?.name === "OlMap") {
      try {
        options.map?.addLayer(layer);
      } catch (e) {
        throw new Error(e?.toString());
      }
    } else if (parent?.type?.name === "OlGroupLayer") {
      try {
        // 先检查是否已经存在该图层
        const layersInGroup = options.groupLayer?.getLayersArray().map(l => l.get("id"));
        if (layersInGroup?.includes(layer.get("id"))) {
          return;
        } else {
          const layers = options.groupLayer?.getLayersArray() || [];
          options.groupLayer?.setLayers(new Collection([...layers, layer], { unique: true }));
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
