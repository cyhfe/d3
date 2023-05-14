import { FeatureCollection, Geometry } from "geojson";
export interface Laureates {
  year: number;
  category: string;
  motivation: string;
  prize_share: string;
  laureate_type: string;
  name: string;
  birth_date: string;
  birth_city: string;
  birth_country: string;
  sex: string;
  organization_name: string;
  organization_city: string;
  organization_country: string;
  birth_country_code: string;
  birt_city_latitude: string;
  birt_city_longitude: string;
}

export type GeoJSON = FeatureCollection<
  Geometry,
  {
    name: string;
    laureates: Laureates[];
  }
>;

export interface WorldMapProps {
  world: GeoJSON;
  laureates: Laureates[];
}
