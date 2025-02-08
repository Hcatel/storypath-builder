
import { useParams } from "react-router-dom";
import { ReactFlowProvider } from '@xyflow/react';
import { useState } from "react";
import { ComponentType, FlowNode } from "@/types/module";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { ModuleFlow } from "@/components/module-builder/ModuleFlow";
import { NodeDetailsPopover } from "@/components/module-builder/NodeDetailsPopover";
import { useNodeSelection } from "@/hooks/useNodeSelection";
import { useModuleBuilderState } from "@/hooks/useModuleBuilderState";
import { useNodeUpdater } from "@/hooks/useNodeUpdater";
import "@xyflow/react/dist/style.css";

export default function BuildPage() {
  const { id } = useParams();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");
  const {
    selectedNode,
    setSelectedNode,
    popoverPosition,
    setPopoverPosition,
    onNodeClick,
    onPaneClick,
  } = useNodeSelection();

  const {
    isLoading,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  } = useModuleBuilderState(id);

  const { saveChanges, onConnect, addNode } = useModuleFlow(
    id || '',
    nodes,
    edges,
    setNodes,
    edges => setEdges(edges)
  );

  const { onNodeUpdate } = useNodeUpdater(nodes, edges, setNodes, setEdges, saveChanges);

  if (isLoading && id && id !== 'create') {
    return <div>Loading...</div>;
  }

  const availableNodes = selectedNode ? nodes.filter(node => node.id !== selectedNode.id) : [];

  return (
    <div className="h-[calc(100vh-10rem)]">
      <ReactFlowProvider>
        <ModuleFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          selectedComponentType={selectedComponentType}
          onComponentTypeChange={setSelectedComponentType}
          onAddNode={() => addNode(selectedComponentType)}
          onSave={saveChanges}
        />
        <NodeDetailsPopover
          selectedNode={selectedNode}
          popoverPosition={popoverPosition}
          onNodeUpdate={onNodeUpdate}
          onClose={() => setSelectedNode(null)}
          availableNodes={availableNodes}
          edges={edges}
          onPositionChange={setPopoverPosition}
        />
      </ReactFlowProvider>
    </div>
  );
}
