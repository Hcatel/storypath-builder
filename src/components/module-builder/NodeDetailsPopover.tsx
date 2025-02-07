
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
  const [localPosition, setLocalPosition] = useState(popoverPosition);

  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(popoverPosition);
    }
  }, [popoverPosition, isDragging]);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!localPosition) return;
    
    const newX = clientX - startDragPos.x;
    const newY = clientY - startDragPos.y;
    
    const newPosition = { x: newX, y: newY };
    setLocalPosition(newPosition);
    onPositionChange?.(newPosition);
  }, [localPosition, startDragPos, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
      e.preventDefault();
      e.stopPropagation();
      
      if (!localPosition) return;
      
      setIsDragging(true);
      setStartDragPos({
        x: e.clientX - localPosition.x,
        y: e.clientY - localPosition.y
      });

      // Set a global flag on the window object
      (window as any).isPopoverDragging = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Clear the global flag
    (window as any).isPopoverDragging = false;
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        updatePosition(e.clientX, e.clientY);
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        (window as any).isPopoverDragging = false;
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, updatePosition]);

  if (!selectedNode || !localPosition) return null;

  return (
    <div 
      className="fixed"
      style={{ 
        left: `${localPosition.x}px`, 
        top: `${localPosition.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
