import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { CSVToHierarchy } from "./hierarchy";
import { Flat } from "./types";
function Hierachical() {
  const [data, setData] = useState<
    | [
        d3.HierarchyNode<Flat>,
        d3.HierarchyNode<Flat>[],
        d3.HierarchyNode<Flat>[]
      ]
    | null
  >(null);

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
  });
  return <div>Hierachical</div>;
}

export default Hierachical;
