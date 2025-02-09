
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(popoverPosition);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(popoverPosition);
    }
  }, [popoverPosition, isDragging]);

  useEffect(() => {
    const wrapper = document.querySelector('[data-radix-popper-content-wrapper]') as HTMLElement;
    const header = wrapper?.querySelector('.popover-header') as HTMLElement;
    
    if (!wrapper || !header) return;

    let initialMouseX = 0;
    let initialMouseY = 0;
    let initialWrapperX = 0;
    let initialWrapperY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
        const wrapperRect = wrapper.getBoundingClientRect();
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialWrapperX = wrapperRect.left;
        initialWrapperY = wrapperRect.top;
        
        setDragOffset({
          x: e.clientX - wrapperRect.left,
          y: e.clientY - wrapperRect.top
        });
        
        setIsDragging(true);
        window.isPopoverDragging = true;
        
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - initialMouseX;
      const deltaY = e.clientY - initialMouseY;
      
      const newX = initialWrapperX + deltaX;
      const newY = initialWrapperY + deltaY;
      
      const newPosition = { x: newX, y: newY };
      setCurrentPosition(newPosition);
      onPositionChange?.(newPosition);
      
      wrapper.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      
      e.preventDefault();
      e.stopPropagation();
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        window.isPopoverDragging = false;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
      window.isPopoverDragging = false;
    };
  }, [isDragging, onPositionChange]);

  if (!selectedNode || !currentPosition) return null;

  return (
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
  );
}
