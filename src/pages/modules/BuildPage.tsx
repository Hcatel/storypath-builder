
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Panel,
  NodeTypes,
  Node,
} from "@xyflow/react";
import { useState } from "react";
import { ComponentType, NodeData, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { nodeTypes, getInitialNode } from "@/constants/moduleComponents";
import { NodeDetailsPanel } from "@/components/nodes/NodeDetailsPanel";
import "@xyflow/react/dist/style.css";

const convertToReactFlowNode = (node: any): FlowNode => ({
  id: node.id.toString(),
  type: node.data.type || "message",
  position: node.position || { x: 0, y: 0 },
  data: node.data as NodeData,
});

export default function BuildPage() {
  const { id } = useParams();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (!id) throw new Error("No module ID provided");
      
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      const convertedNodes = Array.isArray(data.nodes) 
        ? data.nodes.map(convertToReactFlowNode)
        : [];

      const convertedEdges = Array.isArray(data.edges)
        ? data.edges.map((edge: any) => ({
            id: edge.id.toString(),
            source: edge.source.toString(),
            target: edge.target.toString(),
            type: edge.type || 'default',
            data: edge.data || {},
          }))
        : [];

      return {
        ...data,
        nodes: convertedNodes,
        edges: convertedEdges,
      };
    },
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    module?.nodes || [getInitialNode() as FlowNode]
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(
    module?.edges || []
  );

  const { saveChanges, onConnect, addNode } = useModuleFlow(
    id || '',
    nodes,
    edges,
    setNodes,
    setEdges
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const onNodeUpdate = (nodeId: string, data: NodeData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data,
          };
        }
        return node;
      })
    );
  };

  if (isLoading || !id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      <div className="flex-grow">
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
              onComponentTypeChange={setSelectedComponentType}
              onAddNode={() => addNode(selectedComponentType)}
              onSave={saveChanges}
            />
          </Panel>
        </ReactFlow>
      </div>
      <div className="w-96 border-l">
        <NodeDetailsPanel 
          selectedNode={selectedNode}
          onNodeUpdate={onNodeUpdate}
        />
      </div>
    </div>
  );
}
