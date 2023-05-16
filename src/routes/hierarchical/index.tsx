import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { CSVToHierarchy } from "./hierarchy";
import { Data, Flat } from "./types";
import CirclePack from "./CirclePack";
import TreeMap from "./treeMap";
function Hierachical() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    async function getData() {
      const flat = (await d3.csv(
        "data/hierarchical/flat_data.csv",
        d3.autoType
      )) as Flat[];
      const data = CSVToHierarchy(flat);
      setData(data);
    }

    getData();
  }, []);
  return (
    <div>
      {data && (
        <>
          {/* <CirclePack data={data} /> */}
          <TreeMap data={data} />
        </>
      )}
    </div>
  );
}

export default Hierachical;
