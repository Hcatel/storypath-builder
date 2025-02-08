
import { RouterNodeData, NodeData } from "@/types/module";
import { Node } from "@xyflow/react";

export interface RouterChoiceProps {
  choice: { text: string; nextNodeId: string };
  index: number;
  availableNodes: Node<NodeData>[];
  onUpdate: (index: number, updates: { text?: string; nextNodeId?: string }) => void;
  onDelete: (index: number) => void;
  onConfigureConditions: (index: number) => void;
}

export interface RouterChoicesProps {
  data: RouterNodeData;
  availableNodes: Node<NodeData>[];
  onUpdate: (updates: Partial<RouterNodeData>) => void;
  onConfigureConditions: (index: number) => void;
}
