
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
} from "@xyflow/react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComponentType, NodeData } from "@/types/module";
import "@xyflow/react/dist/style.css";

interface ReactFlowNode extends Node {
  data: NodeData;
}

// Convert NodeData to ReactFlow Node type
const convertToReactFlowNode = (node: any): ReactFlowNode => ({
  id: node.id.toString(),
  type: "default",
  position: node.position || { x: 0, y: 0 },
  data: node.data as NodeData,
});

// Initial node when creating a new module
const getInitialNode = (): ReactFlowNode => ({
  id: "1",
  type: "default",
  data: { 
    label: "Start Here",
    type: "message" as ComponentType,
    title: "",
    content: "" 
  },
  position: { x: 250, y: 100 },
});

type ModuleData = {
  id: string;
  nodes: ReactFlowNode[];
  edges: Edge[];
  component_types: ComponentType[];
  [key: string]: any;
};

export default function BuildPage() {
  const { id } = useParams();
  const { toast } = useToast();

  // Fetch module data
  const { data: module, isLoading } = useQuery<ModuleData>({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Convert the JSON data to ReactFlow nodes
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

  // Initialize with stored nodes/edges or default node
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>(
    module?.nodes || [getInitialNode()]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(module?.edges || []);

  // Save changes mutation
  const { mutate: saveChanges } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("modules")
        .update({
          nodes: nodes.map(node => ({
            id: node.id,
            position: node.position,
            data: node.data,
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            data: edge.data,
          })),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module content saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save module content: " + error.message,
      });
    },
  });

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new node
  const addNode = () => {
    const newNode: ReactFlowNode = {
      id: (nodes.length + 1).toString(),
      type: "default",
      data: { 
        label: `Content ${nodes.length + 1}`,
        type: "message" as ComponentType,
        title: "",
        content: ""
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  if (isLoading) {
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
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="space-x-2">
          <Button onClick={addNode} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
          <Button onClick={() => saveChanges()} size="sm">
            Save Changes
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
