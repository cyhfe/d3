import React, { useEffect, useState } from "react";
import Post from "./post.mdx";
import * as d3 from "d3";
import { GeoJSON, Laureates } from "./types";
import WorldMap from "./WorldMap";

function Map() {
  const [world, setWorld] = useState<GeoJSON | null>(null);
  const [laureates, setLaureates] = useState<Laureates[] | null>(null);

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

      setWorld(worldData);
      setLaureates(laureates);
    }
    getData();
  }, []);

  // useEffect(() => {
  //   console.log(world);
  // }, [world]);

  return (
    <div>
      {world && laureates && <WorldMap world={world} laureates={laureates} />}
      <Post />
    </div>
  );
}

export default Map;
