import { FeatureCollection, Geometry } from "geojson";

export type WorldJSON = FeatureCollection<Geometry>;

export interface WorldMapProps {
  data: WorldJSON;
}
