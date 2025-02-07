
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  useReactFlow,
} from '@xyflow/react';
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { Panel } from "@xyflow/react";
import { nodeTypes } from "@/constants/moduleComponents";
import { useEffect, useState, useCallback } from "react";
import { ModuleFlowContextMenu } from "./ModuleFlowContextMenu";
import { useModuleFlowKeyboard } from "@/hooks/useModuleFlowKeyboard";
import { useModuleFlowHistory } from "@/hooks/useModuleFlowHistory";

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
  const [history, setHistory] = useState<FlowNode[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);

  useModuleFlowKeyboard(setNodes, history, currentIndex, setCurrentIndex, nodes, setHistory);
  useModuleFlowHistory(nodes, setHistory, setCurrentIndex, history);

  const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    // Prevent default context menu
    event.preventDefault();
    
    // Get the flow wrapper element
    const flowWrapper = document.querySelector('.react-flow') as HTMLElement;
    if (!flowWrapper) return;

    // Get the bounds of the flow wrapper
    const flowBounds = flowWrapper.getBoundingClientRect();

    // Calculate position relative to the flow wrapper
    const x = event.clientX - flowBounds.left;
    const y = event.clientY - flowBounds.top;

    setContextMenu({
      x,
      y,
      nodeId: node.id
    });
  };

  const handleDeleteNode = () => {
    if (contextMenu) {
      const newNodes = nodes.filter(n => n.id !== contextMenu.nodeId);
      setNodes(newNodes);
      setHistory(prev => [...prev.slice(0, currentIndex + 1), newNodes]);
      setCurrentIndex(prev => prev + 1);
      setContextMenu(null);
    }
  };

  const handlePaneClick = () => {
    setContextMenu(null);
    onPaneClick();
  };

  const nodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case 'message':
        return '#6366f1';
      case 'video':
        return '#f43f5e';
      case 'router':
        return '#14b8a6';
      case 'text_input':
        return '#8b5cf6';
      case 'multiple_choice':
        return '#f59e0b';
      case 'ranking':
        return '#10b981';
      default:
        return '#64748b';
    }
  }, []);

  useEffect(() => {
    const handleDeleteEvent = (event: CustomEvent) => {
      const nodeId = event.detail.id;
      const newNodes = nodes.filter(n => n.id !== nodeId);
      setNodes(newNodes);
      setHistory(prev => [...prev.slice(0, currentIndex + 1), newNodes]);
      setCurrentIndex(prev => prev + 1);
    };

    window.addEventListener('delete-node', handleDeleteEvent as EventListener);
    return () => window.removeEventListener('delete-node', handleDeleteEvent as EventListener);
  }, [nodes, setNodes, currentIndex, setHistory, setCurrentIndex]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes as NodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={handlePaneClick}
      onNodeContextMenu={handleNodeContextMenu}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap 
        nodeColor={nodeColor}
        nodeStrokeWidth={3}
        maskColor="rgb(255, 255, 255, 0.8)"
      />
      <Panel position="top-left">
        <ModuleToolbar
          selectedComponentType={selectedComponentType}
          onComponentTypeChange={onComponentTypeChange}
          onAddNode={onAddNode}
          onSave={onSave}
        />
      </Panel>
      <ModuleFlowContextMenu 
        contextMenu={contextMenu}
        onDeleteNode={handleDeleteNode}
      />
    </ReactFlow>
  );
}
