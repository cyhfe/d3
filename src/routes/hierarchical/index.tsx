import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { CSVToHierarchy, JSONToHierarchy } from "./hierarchy";
import { Flat, TreeNode } from "./types";
function Hierachical() {
  const [flat, setFlat] = useState<Flat | null>(null);
  const [tree, setTree] = useState<TreeNode | null>(null);
  useEffect(() => {
    async function getData() {
      const flat = (await d3.csv(
        "data/hierarchical/flat_data.csv",
        d3.autoType
      )) as Flat;
      const tree = (await d3.json(
        "data/hierarchical/hierarchical-data.json"
      )) as TreeNode;

      // console.log(flat);
      console.log(tree);
      CSVToHierarchy(flat);
      JSONToHierarchy(tree);
    }

    getData();
  });
  return <div>Hierachical</div>;
}

export default Hierachical;
