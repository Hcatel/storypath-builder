import { useState, useEffect } from "react";
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
  onPositionChange?: (position: { x: number; y: number }) => void;
};

export function NodeDetailsPopover({
  selectedNode,
  popoverPosition,
  onNodeUpdate,
  onClose,
  availableNodes,
  onPositionChange,
}: NodeDetailsPopoverProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
      e.preventDefault();
      setIsDragging(true);
      setStartDragPos({
        x: e.clientX - (popoverPosition?.x || 0),
        y: e.clientY - (popoverPosition?.y || 0)
      });

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging) return;
        
        moveEvent.preventDefault();
        const newX = moveEvent.clientX - startDragPos.x;
        const newY = moveEvent.clientY - startDragPos.y;
        
        console.log('Dragging:', { newX, newY, startPos: startDragPos });
        
        if (onPositionChange) {
          onPositionChange({ x: newX, y: newY });
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  if (!selectedNode || !popoverPosition) return null;

  return (
    <div 
      className="fixed"
      style={{ 
        left: popoverPosition.x, 
        top: popoverPosition.y,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      <Popover open={selectedNode !== null} onOpenChange={onClose}>
        <PopoverTrigger asChild>
          <div className="w-0 h-0" />
        </PopoverTrigger>
        <PopoverContent side="right" className="p-0 w-[400px] resize overflow-auto" style={{ maxWidth: 'none' }}>
          <div className="popover-header bg-secondary p-2 cursor-move select-none">
            Drag to move
          </div>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={100}>
              <NodeDetailsPanel 
                selectedNode={selectedNode}
                onNodeUpdate={onNodeUpdate}
                availableNodes={availableNodes}
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
