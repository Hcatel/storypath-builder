
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
    console.log('Popover position updated:', { popoverPosition, currentPosition });
    setCurrentPosition(popoverPosition);
  }, [popoverPosition]);

  useEffect(() => {
    console.log('Current position state updated:', currentPosition);
  }, [currentPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
      e.preventDefault();
      console.log('Mouse down on header:', { 
        clientX: e.clientX, 
        clientY: e.clientY,
        currentPos: currentPosition 
      });
      
      setIsDragging(true);
      setStartDragPos({
        x: e.clientX - (currentPosition?.x || 0),
        y: e.clientY - (currentPosition?.y || 0)
      });
    }
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!currentPosition) return;
    
    const newX = clientX - startDragPos.x;
    const newY = clientY - startDragPos.y;

    console.log('Updating position:', { 
      newX,
      newY,
      startDragPos,
      clientX,
      clientY,
      isDragging
    });

    setCurrentPosition({ x: newX, y: newY });
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    console.log('Mouse up, ending drag');
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        updatePosition(e.clientX, e.clientY);
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
  }, [isDragging]);

  if (!selectedNode || !currentPosition) {
    console.log('Not rendering popover:', { selectedNode, currentPosition });
    return null;
  }

  return (
    <div 
      className="fixed"
      style={{ 
        left: `${currentPosition.x}px`, 
        top: `${currentPosition.y}px`,
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transform: 'translate(0, 0)'
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
