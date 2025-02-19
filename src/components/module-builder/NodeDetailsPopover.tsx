
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
  const [key, setKey] = useState(0); // Add a key to force re-render

  // Update key when selectedNode or its data changes
  useEffect(() => {
    if (selectedNode) {
      setKey(prev => prev + 1);
    }
  }, [selectedNode, selectedNode?.data]);

  useEffect(() => {
    if (!isDragging) {
      setPosition(popoverPosition);
    }
  }, [popoverPosition, isDragging]);

  useEffect(() => {
    const initializeDragging = () => {
      const wrapper = document.querySelector('[data-radix-popper-content-wrapper]');
      if (!wrapper) return;

      const header = wrapper.querySelector('.popover-header');
      if (!header) return;

      const handleMouseDown = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('.popover-header')) {
          e.preventDefault();
          e.stopPropagation();
          
          setIsDragging(true);
          const wrapperElement = wrapper as HTMLElement;
          const wrapperRect = wrapperElement.getBoundingClientRect();
          
          setStartPosition({
            x: e.clientX - wrapperRect.left,
            y: e.clientY - wrapperRect.top
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const newPosition = {
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y
        };
        
        setPosition(newPosition);
        onPositionChange?.(newPosition);

        const wrapperElement = wrapper as HTMLElement;
        wrapperElement.style.transform = `translate3d(${newPosition.x}px, ${newPosition.y}px, 0)`;
      };

      const handleMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          document.removeEventListener('mousemove', handleMouseMove);
        }
      };

      header.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        header.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    };

    // Small delay to ensure the wrapper is mounted
    const timeoutId = setTimeout(initializeDragging, 0);
    return () => clearTimeout(timeoutId);
  }, [isDragging, position, startPosition, onPositionChange]);

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
              key={key}
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
