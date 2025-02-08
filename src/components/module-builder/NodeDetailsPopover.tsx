
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

  useEffect(() => {
    const wrapper = document.querySelector('[data-radix-popper-content-wrapper]') as HTMLElement;
    const header = wrapper?.querySelector('.popover-header') as HTMLElement;
    
    if (!wrapper || !header) return;

    let initialWrapperX = 0;
    let initialWrapperY = 0;
    let mouseStartX = 0;
    let mouseStartY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
        e.preventDefault();
        e.stopPropagation();
        
        setIsDragging(true);
        (window as any).isPopoverDragging = true;

        const wrapperRect = wrapper.getBoundingClientRect();
        initialWrapperX = wrapperRect.left;
        initialWrapperY = wrapperRect.top;
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();
      
      const deltaX = e.clientX - mouseStartX;
      const deltaY = e.clientY - mouseStartY;
      
      const newX = initialWrapperX + deltaX;
      const newY = initialWrapperY + deltaY;
      
      const newPosition = { x: newX, y: newY };
      setPosition(newPosition);
      onPositionChange?.(newPosition);

      wrapper.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsDragging(false);
      (window as any).isPopoverDragging = false;
    };

    // Add event listeners
    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);
      (window as any).isPopoverDragging = false;
    };
  }, [isDragging, onPositionChange]); // Only re-run when isDragging or onPositionChange changes

  if (!selectedNode || !position) return null;

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
