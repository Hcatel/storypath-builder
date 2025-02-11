
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
  showDeleteButton?: boolean;
}

export function RouterChoice({
  choice,
  index,
  availableNodes,
  onUpdate,
  onDelete,
  onConfigureConditions,
  showDeleteButton = true,
}: RouterChoiceProps) {
  const currentValue = choice.nextNodeId || "none";
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newValue = e.target.value;
    onUpdate(index, { text: newValue });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(index);
  };

  const handleConfigureConditions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfigureConditions(index);
  };

  const handleNodeSelection = (value: string) => {
    onUpdate(index, { nextNodeId: value === "none" ? "" : value });
    
    // Force a reflow of the popover content
    requestAnimationFrame(() => {
      const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
      if (wrapper) {
        wrapper.setAttribute('style', wrapper.getAttribute('style') || '');
      }
    });
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className={`space-y-2 border rounded-lg p-3 ${!choice.nextNodeId ? 'border-destructive' : ''}`}>
      <div className="flex gap-2">
        <Input
          value={choice.text}
          onChange={handleTextChange}
          onClick={handleInputClick}
          placeholder={`Choice ${index + 1}`}
        />
        {showDeleteButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleConfigureConditions}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <label className="text-sm font-medium">Connect to node</label>
        <Select
          value={currentValue}
          onValueChange={handleNodeSelection}
        >
          <SelectTrigger className={!choice.nextNodeId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a node" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
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
