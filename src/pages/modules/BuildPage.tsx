
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
  Node,
  Edge,
  Panel
} from "@xyflow/react";
import { useState } from "react";
import { ComponentType } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { nodeTypes, getInitialNode } from "@/constants/moduleComponents";
import "@xyflow/react/dist/style.css";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const convertToReactFlowNode = (node: any): Node => ({
  id: node.id.toString(),
  type: node.data.type || "message",
  position: node.position || { x: 0, y: 0 },
  data: node.data,
});

export default function BuildPage() {
  const { id } = useParams();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");

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

  const [nodes, setNodes, onNodesChange] = useNodesState(
    module?.nodes || [getInitialNode()]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    module?.edges || []
  );

  const { saveChanges, onConnect, addNode } = useModuleFlow(
    id || '',
    nodes,
    edges,
    setNodes,
    setEdges
  );

  if (isLoading || !id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <ModuleToolbar
            selectedComponentType={selectedComponentType}
            onComponentTypeChange={setSelectedComponentType}
            onAddNode={() => addNode(selectedComponentType)}
            onSave={saveChanges}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}
