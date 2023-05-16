export type Flat = Node[];
export interface Node {
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
