
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  useReactFlow,
  useKeyPress,
} from "@xyflow/react";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { Panel } from "@xyflow/react";
import { nodeTypes } from "@/constants/moduleComponents";
import { useCallback, useEffect, useState } from "react";

type ModuleFlowProps = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  selectedComponentType: ComponentType;
  onComponentTypeChange: (type: ComponentType) => void;
  onAddNode: () => void;
  onSave: () => void;
};

export function ModuleFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  selectedComponentType,
  onComponentTypeChange,
  onAddNode,
  onSave,
}: ModuleFlowProps) {
  const { getNodes, setNodes } = useReactFlow();
  const isCPressed = useKeyPress('c');
  const isVPressed = useKeyPress('v');
  const isXPressed = useKeyPress('x');
  const [history, setHistory] = useState<FlowNode[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = async (event: KeyboardEvent) => {
      const selectedNodes = getNodes().filter(node => node.selected);
      
      // Only proceed if Control/Command is pressed
      if ((event.ctrlKey || event.metaKey)) {
        // Handle undo/redo
        if (event.key === 'z') {
          if (event.shiftKey) {
            // Redo
            if (currentIndex < history.length - 1) {
              const nextState = history[currentIndex + 1];
              setNodes(nextState);
              setCurrentIndex(currentIndex + 1);
            }
          } else {
            // Undo
            if (currentIndex > 0) {
              const previousState = history[currentIndex - 1];
              setNodes(previousState);
              setCurrentIndex(currentIndex - 1);
            }
          }
          event.preventDefault();
        }

        // Copy/Cut/Paste operations
        if (selectedNodes.length > 0) {
          if (event.key === 'c') {
            const nodesToCopy = selectedNodes.map(node => ({
              ...node,
              id: `${node.id}-copy`,
              position: { 
                x: node.position.x + 50, 
                y: node.position.y + 50 
              }
            }));
            await navigator.clipboard.writeText(JSON.stringify(nodesToCopy));
          }
          
          if (event.key === 'x') {
            await navigator.clipboard.writeText(JSON.stringify(selectedNodes));
            const newNodes = nodes.filter(node => !selectedNodes.find(n => n.id === node.id));
            setNodes(newNodes);
            // Add to history
            setHistory(prev => [...prev.slice(0, currentIndex + 1), newNodes]);
            setCurrentIndex(prev => prev + 1);
          }
        }
        
        if (event.key === 'v') {
          try {
            const clipboardText = await navigator.clipboard.readText();
            const pastedNodes = JSON.parse(clipboardText);
            
            const timestamp = Date.now();
            const newNodes = pastedNodes.map((node: FlowNode, index: number) => ({
              ...node,
              id: `${timestamp}-${index}`,
              position: {
                x: node.position.x + 100,
                y: node.position.y + 100
              }
            }));
            
            const updatedNodes = [...getNodes(), ...newNodes];
            setNodes(updatedNodes);
            // Add to history
            setHistory(prev => [...prev.slice(0, currentIndex + 1), updatedNodes]);
            setCurrentIndex(prev => prev + 1);
          } catch (error) {
            console.error('Failed to paste nodes:', error);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [getNodes, setNodes, history, currentIndex]);

  // Save initial state
  useEffect(() => {
    if (nodes.length > 0 && history.length === 0) {
      setHistory([nodes]);
      setCurrentIndex(0);
    }
  }, [nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes as NodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
      <Panel position="top-left">
        <ModuleToolbar
          selectedComponentType={selectedComponentType}
          onComponentTypeChange={onComponentTypeChange}
          onAddNode={onAddNode}
          onSave={onSave}
        />
      </Panel>
    </ReactFlow>
  );
}
