
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
  useReactFlow,
  useKeyPress,
} from '@xyflow/react';
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { Panel } from "@xyflow/react";
import { nodeTypes } from "@/constants/moduleComponents";
import { useState } from "react";
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
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
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
      <MiniMap />
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
