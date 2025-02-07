
import React, { useState, useEffect } from "react";
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
import type { FlowNode } from "@/types/module";

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
  const { getNodes, setNodes } = useReactFlow();
  const [history, setHistory] = useState<FlowNode[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Initialize history with current nodes
  useEffect(() => {
    const currentNodes = getNodes() as FlowNode[];
    if (history.length === 0) {
      setHistory([currentNodes]);
      setCurrentIndex(0);
    }
  }, []);

  const onUndo = () => {
    if (currentIndex > 0) {
      const previousState = history[currentIndex - 1];
      setNodes(previousState);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      setNodes(nextState);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Save state to history when nodes change
  useEffect(() => {
    const currentNodes = getNodes() as FlowNode[];
    const lastState = history[currentIndex];
    
    if (!lastState || JSON.stringify(lastState) !== JSON.stringify(currentNodes)) {
      const newHistory = [...history.slice(0, currentIndex + 1), currentNodes];
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }
  }, [getNodes()]);

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
          disabled={currentIndex <= 0}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          onClick={onRedo} 
          size="sm" 
          variant="outline"
          disabled={currentIndex >= history.length - 1}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
