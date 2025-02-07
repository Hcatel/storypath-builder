
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeTypes,
} from "@xyflow/react";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { Panel } from "@xyflow/react";
import { nodeTypes } from "@/constants/moduleComponents";

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
