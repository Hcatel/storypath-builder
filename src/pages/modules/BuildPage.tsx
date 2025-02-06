
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
  NodeTypes,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComponentType, NodeData } from "@/types/module";
import { MessageNode } from "@/components/nodes/MessageNode";
import { VideoNode } from "@/components/nodes/VideoNode";
import { RouterNode } from "@/components/nodes/RouterNode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@xyflow/react/dist/style.css";

// Define the nodeTypes mapping for React Flow
const nodeTypes: NodeTypes = {
  message: MessageNode,
  video: VideoNode,
  router: RouterNode,
};

// Convert data to ReactFlow Node type
const convertToReactFlowNode = (node: any): Node => ({
  id: node.id.toString(),
  type: node.data.type || "message",
  position: node.position || { x: 0, y: 0 },
  data: node.data,
});

// Initial node when creating a new module
const getInitialNode = (): Node => ({
  id: "1",
  type: "message",
  position: { x: 250, y: 100 },
  data: { 
    type: "message" as const,
    label: "Start Here",
    title: "Welcome",
    content: "Start your module here" 
  },
});

const componentOptions: { value: ComponentType; label: string }[] = [
  { value: "message", label: "Message" },
  { value: "video", label: "Video" },
  { value: "router", label: "Decision Router" },
  { value: "text_input", label: "Text Input" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "ranking", label: "Ranking" },
  { value: "likert_scale", label: "Likert Scale" },
  { value: "matching", label: "Matching" },
];

type ModuleData = {
  id: string;
  nodes: Node[];
  edges: Edge[];
  component_types: ComponentType[];
  [key: string]: any;
};

export default function BuildPage() {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Selected component type for new nodes
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");

  // Fetch module data
  const { data: module, isLoading } = useQuery({
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
  const [nodes, setNodes, onNodesChange] = useNodesState(
    module?.nodes || [getInitialNode()]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(module?.edges || []);

  // Save changes mutation
  const { mutate: saveChanges } = useMutation({
    mutationFn: async () => {
      // Convert nodes to a Supabase-compatible format
      const nodeData = nodes.map(node => ({
        id: node.id,
        position: node.position,
        data: node.data,
        type: node.type,
      }));

      // Convert edges to a Supabase-compatible format
      const edgeData = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default',
        data: edge.data || {},
      }));

      const { error } = await supabase
        .from("modules")
        .update({
          nodes: nodeData,
          edges: edgeData,
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
    (params: Connection) => {
      // If the source is a router node, use the sourceHandle as the choice index
      const sourceNode = nodes.find(node => node.id === params.source);
      if (sourceNode?.type === 'router' && params.sourceHandle) {
        const choiceIndex = parseInt(params.sourceHandle.replace('choice-', ''));
        const updatedNodes = nodes.map(node => {
          if (node.id === params.source) {
            const updatedChoices = [...node.data.choices];
            updatedChoices[choiceIndex] = {
              ...updatedChoices[choiceIndex],
              nextComponentId: params.target,
            };
            return {
              ...node,
              data: {
                ...node.data,
                choices: updatedChoices,
              },
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setNodes, setEdges]
  );

  // Add new node
  const addNode = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: selectedComponentType,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: getInitialDataForType(selectedComponentType),
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Helper to get initial data for each component type
  const getInitialDataForType = (type: ComponentType) => {
    switch (type) {
      case "message":
        return {
          type: "message" as const,
          label: `Message ${nodes.length + 1}`,
          title: "",
          content: "",
        };
      case "video":
        return {
          type: "video" as const,
          label: `Video ${nodes.length + 1}`,
          title: "",
          videoUrl: "",
        };
      case "router":
        return {
          type: "router" as const,
          label: `Decision ${nodes.length + 1}`,
          question: "",
          choices: [
            { text: "Choice 1", nextComponentId: "" },
            { text: "Choice 2", nextComponentId: "" },
          ],
        };
      // Add other component types here
      default:
        return {
          type: "message" as const,
          label: `Component ${nodes.length + 1}`,
          title: "",
          content: "",
        };
    }
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
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="space-x-2">
          <Select
            value={selectedComponentType}
            onValueChange={(value: ComponentType) => setSelectedComponentType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select component type" />
            </SelectTrigger>
            <SelectContent>
              {componentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
