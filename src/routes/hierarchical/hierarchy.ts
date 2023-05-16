import * as d3 from "d3";
import { Flat, Node, TreeNode } from "./types";
export function CSVToHierarchy(data: Flat) {
  const hierarchyGenerator = d3
    .stratify<Node>()
    .id((d) => d.child)
    .parentId((d) => d.parent);

  const root = hierarchyGenerator(data);
  const descendants = root.descendants();
  const leaves = root.leaves();
  return [root, descendants, leaves];
}

export function JSONToHierarchy(data: TreeNode) {
  const root = d3.hierarchy(data);

  const descendants = root.descendants();
  const leaves = root.leaves();
  debugger;
  return [root, descendants, leaves];
}
