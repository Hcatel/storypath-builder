
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Settings } from "lucide-react";
import { NodeData } from "@/types/module";
import { Node } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RouterChoiceProps {
  choice: { text: string; nextNodeId: string };
  index: number;
  availableNodes: Node<NodeData>[];
  onUpdate: (index: number, updates: { text?: string; nextNodeId?: string }) => void;
  onDelete: (index: number) => void;
  onConfigureConditions: (index: number) => void;
}

export function RouterChoice({
  choice,
  index,
  availableNodes,
  onUpdate,
  onDelete,
  onConfigureConditions,
}: RouterChoiceProps) {
  return (
    <div className="space-y-2 border rounded-lg p-3">
      <div className="flex gap-2">
        <Input
          value={choice.text}
          onChange={(e) => onUpdate(index, { text: e.target.value })}
          placeholder={`Choice ${index + 1}`}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(index)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConfigureConditions(index)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <label className="text-sm font-medium">Connect to node</label>
        <Select
          key={`${choice.nextNodeId}-${availableNodes.length}`}
          value={choice.nextNodeId || ""}
          onValueChange={(value) => onUpdate(index, { nextNodeId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a node" />
          </SelectTrigger>
          <SelectContent>
            {availableNodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.data.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
