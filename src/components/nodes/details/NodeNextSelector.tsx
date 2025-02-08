
import { Node } from "@xyflow/react";
import { NodeData } from "@/types/module";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodeNextSelectorProps {
  nodeData: NodeData;
  availableNodes: Node<NodeData>[];
  onNextNodeChange: (nextNodeId: string | null) => void;
}

export function NodeNextSelector({ 
  nodeData, 
  availableNodes, 
  onNextNodeChange 
}: NodeNextSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Next Node</Label>
      <Select
        value={nodeData?.nextNodeId || "none"}
        onValueChange={onNextNodeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select next node" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {availableNodes.map((node) => (
            <SelectItem key={node.id} value={node.id}>
              {node.data.label || `${node.type} ${node.id}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
