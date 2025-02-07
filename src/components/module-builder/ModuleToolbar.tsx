
import { Button } from "@/components/ui/button";
import { Plus, Undo2, Redo2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentType } from "@/types/module";
import { componentOptions } from "@/constants/moduleComponents";
import { useReactFlow } from "@xyflow/react";

interface ModuleToolbarProps {
  selectedComponentType: ComponentType;
  onComponentTypeChange: (value: ComponentType) => void;
  onAddNode: () => void;
  onSave: () => void;
}

export function ModuleToolbar({
  selectedComponentType,
  onComponentTypeChange,
  onAddNode,
  onSave,
}: ModuleToolbarProps) {
  const { addNodes, getNodes, setNodes } = useReactFlow();

  const onUndo = () => {
    // Get the current nodes and revert to previous state
    const currentNodes = getNodes();
    if (currentNodes.length > 0) {
      // Remove the last node
      setNodes(currentNodes.slice(0, -1));
    }
  };

  const onRedo = () => {
    // For now, redo is disabled as we need to implement a proper history stack
    return;
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Select
        value={selectedComponentType}
        onValueChange={onComponentTypeChange}
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Select component type" />
        </SelectTrigger>
        <SelectContent>
          {componentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onAddNode} size="sm">
        <Plus className="w-4 h-4 mr-2" />
        Add Node
      </Button>
      <Button onClick={onSave} size="sm">
        Save Changes
      </Button>
      <div className="flex items-center gap-1">
        <Button 
          onClick={onUndo} 
          size="sm" 
          variant="outline"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          onClick={onRedo} 
          size="sm" 
          variant="outline"
          disabled={true}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
