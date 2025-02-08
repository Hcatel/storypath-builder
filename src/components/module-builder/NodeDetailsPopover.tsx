
import { useState, useEffect, useCallback } from "react";
import { Node } from "@xyflow/react";
import { NodeData } from "@/types/module";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { NodeDetailsPanel } from "@/components/nodes/NodeDetailsPanel";

type NodeDetailsPopoverProps = {
  selectedNode: Node<NodeData> | null;
  popoverPosition: { x: number; y: number } | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
  onClose: () => void;
  availableNodes: Node<NodeData>[];
  edges: { source: string; target: string; }[];
  onPositionChange?: (position: { x: number; y: number }) => void;
};

export function NodeDetailsPopover({
  selectedNode,
  popoverPosition,
  onNodeUpdate,
  onClose,
  availableNodes,
  edges,
  onPositionChange,
}: NodeDetailsPopoverProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(popoverPosition);

  useEffect(() => {
    if (!isDragging) {
      setPosition(popoverPosition);
    }
  }, [popoverPosition, isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - (position?.x || 0),
        y: e.clientY - (position?.y || 0)
      });
      
      (window as any).isPopoverDragging = true;
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && position) {
      e.preventDefault();
      e.stopPropagation();
      
      const newPosition = {
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      };
      
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  }, [isDragging, position, startPosition, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    (window as any).isPopoverDragging = false;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!selectedNode || !position) return null;

  return (
    <div 
      className="fixed"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <Popover open={selectedNode !== null} onOpenChange={onClose}>
        <PopoverTrigger asChild>
          <div className="w-0 h-0" />
        </PopoverTrigger>
        <PopoverContent side="right" className="p-0 w-[400px] resize overflow-auto" style={{ maxWidth: 'none' }}>
          <div className="popover-header bg-secondary p-2 cursor-grab active:cursor-grabbing select-none">
            Drag to move
          </div>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={100}>
              <NodeDetailsPanel 
                selectedNode={selectedNode}
                onNodeUpdate={onNodeUpdate}
                availableNodes={availableNodes}
                edges={edges}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={0} minSize={0} />
          </ResizablePanelGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}
