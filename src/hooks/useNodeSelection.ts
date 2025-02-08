
import { useState } from "react";
import { FlowNode } from "@/types/module";

export function useNodeSelection() {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    if ((window as any).isPopoverDragging) return;
    
    event.stopPropagation();
    const bounds = (event.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({ x: bounds.right + 10, y: bounds.top });
    setSelectedNode(node as FlowNode);
  };

  const onPaneClick = () => {
    if ((window as any).isPopoverDragging) return;
    
    setSelectedNode(null);
    setPopoverPosition(null);
  };

  return {
    selectedNode,
    setSelectedNode,
    popoverPosition,
    setPopoverPosition,
    onNodeClick,
    onPaneClick,
  };
}
