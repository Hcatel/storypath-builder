
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
import { useCallback, useEffect } from "react";

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
  const isZPressed = useKeyPress('z');
  const isYPressed = useKeyPress('y');
  const { undo, redo } = useReactFlow();

  // Handle clipboard operations
  useEffect(() => {
    const handleKeyboard = async (event: KeyboardEvent) => {
      const selectedNodes = getNodes().filter(node => node.selected);
      
      // Only proceed if we have selected nodes and Control/Command is pressed
      if ((event.ctrlKey || event.metaKey)) {
        // Undo
        if (event.key === 'z') {
          undo();
        }
        
        // Redo
        if (event.key === 'y' || (event.shiftKey && event.key === 'z')) {
          redo();
        }

        // Copy/Cut/Paste operations
        if (selectedNodes.length > 0) {
          // Copy
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
          
          // Cut
          if (event.key === 'x') {
            await navigator.clipboard.writeText(JSON.stringify(selectedNodes));
            setNodes(nodes => nodes.filter(node => !selectedNodes.find(n => n.id === node.id)));
          }
        }
        
        // Paste
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
            
            setNodes(nodes => [...nodes, ...newNodes]);
          } catch (error) {
            console.error('Failed to paste nodes:', error);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [getNodes, setNodes, undo, redo]);

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
