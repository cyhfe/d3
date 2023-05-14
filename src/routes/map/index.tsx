import React, { useEffect, useState } from "react";
import Post from "./post.mdx";
import * as d3 from "d3";
import { City, GeoJSON, Laureates } from "./types";
import WorldMap from "./WorldMap";

function Map() {
  const [world, setWorld] = useState<GeoJSON | null>(null);
  const [laureates, setLaureates] = useState<Laureates[] | null>(null);
  const [city, SetCity] = useState<City[] | null>(null);

  useEffect(() => {
    async function getData() {
      const worldData = (await d3.json("data/map/world.json")) as GeoJSON;
      const laureates = (await d3.json(
        "data/map/laureates.json"
      )) as Laureates[];

      worldData.features.forEach((country) => {
        country.properties.laureates = laureates.filter(
          (laureate) => laureate.birth_country === country.properties.name
        );
      });

      const cities: City[] = [];
      laureates.forEach((laureate) => {
        if (laureate.birth_country !== "" && laureate.birth_city !== "") {
          const relatedCity =
            cities.find((city) => city.city === laureate.birth_city) &&
            cities.find((city) => city.country === laureate.birth_country);

          if (relatedCity) {
            relatedCity.laureates.push(laureate);
          } else {
            cities.push({
              city: laureate.birth_city,
              country: laureate.birth_country,
              latitude: Number(laureate.birt_city_latitude),
              longitude: Number(laureate.birt_city_longitude),
              laureates: [laureate],
            });
          }
        }
      });

      setWorld(worldData);
      setLaureates(laureates);
      SetCity(cities);
    }
    getData();
  }, []);

  // useEffect(() => {
  //   console.log(world);
  // }, [world]);

  return (
    <div>
      {world && laureates && (
        <WorldMap world={world} laureates={laureates} city={city} />
      )}
      <Post />
    </div>
  );
}

export default Map;
