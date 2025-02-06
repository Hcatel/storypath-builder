
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentType } from "@/types/module";
import { componentOptions } from "@/constants/moduleComponents";

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
    </div>
  );
}
