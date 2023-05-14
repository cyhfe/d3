import React, { useEffect, useState } from "react";
import Post from "./post.mdx";
import * as d3 from "d3";
import { WorldJSON } from "./types";
import WorldMap from "./WorldMap";

function Map() {
  const [world, setWorld] = useState<WorldJSON | null>(null);

  useEffect(() => {
    async function getData() {
      const res = (await d3.json("data/map/world.json")) as WorldJSON;
      setWorld(res);
    }
    getData();
  }, []);

  // useEffect(() => {
  //   console.log(world);
  // }, [world]);

  return (
    <div>
      {world && <WorldMap data={world} />}
      <Post />
    </div>
  );
}

export default Map;
