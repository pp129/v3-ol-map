import type Feature from "ol/Feature";
import type VectorSource from "ol/source/Vector";

export const appendFeatures = (target: Feature[], features: Feature[]): void => {
  for (const feature of features) target.push(feature);
};

export const replaceOwnedFeatures = (
  source: VectorSource,
  previousFeatures: Feature[],
  nextFeatures: Feature[],
): Feature[] => {
  previousFeatures.forEach(feature => source.removeFeature(feature));
  source.addFeatures(nextFeatures);
  return nextFeatures;
};
