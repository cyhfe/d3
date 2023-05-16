export interface Flat {
  child: string;
  parent?: string;
  total_speakers?: number;
  native_speakers?: number;
}

export interface TreeNode {
  name: string;
  native_speakers?: number;
  total_speakers?: number;
  children?: TreeNode[];
}

export type Data = [
  d3.HierarchyNode<Flat>,
  d3.HierarchyNode<Flat>[],
  d3.HierarchyNode<Flat>[]
];

export interface CirclePackProps {
  data: Data;
}

export interface Layout {
  r: number;
  value: number;
  x: number;
  y: number;
}
