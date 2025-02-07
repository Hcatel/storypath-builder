
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
  const [currentPosition, setCurrentPosition] = useState(popoverPosition);

  useEffect(() => {
    setCurrentPosition(popoverPosition);
  }, [popoverPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
      console.log('Mouse down on header:', { 
        clientX: e.clientX, 
        clientY: e.clientY,
        currentPos: currentPosition 
      });
      
      e.preventDefault();
      setIsDragging(true);
      setStartDragPos({
        x: e.clientX - (currentPosition?.x || 0),
        y: e.clientY - (currentPosition?.y || 0)
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !currentPosition) return;

    e.preventDefault();
    const newX = e.clientX - startDragPos.x;
    const newY = e.clientY - startDragPos.y;

    console.log('Mouse move:', { 
      isDragging,
      newX,
      newY,
      startDragPos,
      clientX: e.clientX,
      clientY: e.clientY
    });

    setCurrentPosition({ x: newX, y: newY });
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    console.log('Mouse up, ending drag');
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!currentPosition) return;
        
        const newX = e.clientX - startDragPos.x;
        const newY = e.clientY - startDragPos.y;

        console.log('Global mouse move:', { 
          newX,
          newY,
          startDragPos,
          clientX: e.clientX,
          clientY: e.clientY
        });

        setCurrentPosition({ x: newX, y: newY });
        if (onPositionChange) {
          onPositionChange({ x: newX, y: newY });
        }
      };

      const handleGlobalMouseUp = () => {
        console.log('Global mouse up');
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, startDragPos, currentPosition, onPositionChange]);

  if (!selectedNode || !currentPosition) return null;

  return (
    <div 
      className="fixed"
      style={{ 
        left: currentPosition.x, 
        top: currentPosition.y,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
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
