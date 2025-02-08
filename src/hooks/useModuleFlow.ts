import { useCallback } from "react";
import { Connection } from "@xyflow/react";
import { ComponentType, NodeData, RouterNodeData, FlowNode, FlowEdge } from "@/types/module";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const getInitialDataForType = (type: ComponentType, nodeCount: number): NodeData => {
  switch (type) {
    case "router":
      return {
        type: "router",
        label: `Decision ${nodeCount + 1}`,
        question: "",
        choices: [
          { text: "Choice 1", nextNodeId: "" },
          { text: "Choice 2", nextNodeId: "" },
        ],
      };
    case "message":
      return {
        type: "message",
        label: `Message ${nodeCount + 1}`,
        title: "",
        content: "",
      };
    case "video":
      return {
        type: "video",
        label: `Video ${nodeCount + 1}`,
        title: "",
        videoUrl: "",
      };
    case "text_input":
      return {
        type: "text_input",
        label: `Text Input ${nodeCount + 1}`,
        question: "",
      };
    case "multiple_choice":
      return {
        type: "multiple_choice",
        label: `Multiple Choice ${nodeCount + 1}`,
        question: "",
        options: ["Option 1", "Option 2"],
        allowMultiple: false,
      };
    case "ranking":
      return {
        type: "ranking",
        label: `Ranking ${nodeCount + 1}`,
        title: "",
        instructions: "",
        options: ["Option 1", "Option 2"],
      };
    default:
      return {
        type: "message",
        label: `Component ${nodeCount + 1}`,
        title: "",
        content: "",
      };
  }
};

export const useModuleFlow = (
  moduleId: string,
  nodes: FlowNode[],
  edges: FlowEdge[],
  setNodes: (nodes: FlowNode[]) => void,
  setEdges: (edges: FlowEdge[]) => void
) => {
  const { toast } = useToast();

  const { mutate: saveChanges } = useMutation({
    mutationFn: async () => {
      const nodeData = nodes.map(node => ({
        id: node.id,
        position: node.position,
        data: node.data,
        type: node.type,
      }));

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
          nodes: nodeData as unknown as JsonValue[],
          edges: edgeData as unknown as JsonValue[],
          updated_at: new Date().toISOString(),
        })
        .eq("id", moduleId);

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

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(node => node.id === params.source);
      if (sourceNode?.type === 'router' && params.sourceHandle) {
        const routerData = sourceNode.data as RouterNodeData;
        const choiceIndex = parseInt(params.sourceHandle.replace('choice-', ''));
        const updatedNodes = nodes.map(node => {
          if (node.id === params.source) {
            const choices = [...routerData.choices];
            choices[choiceIndex] = {
              ...choices[choiceIndex],
              nextNodeId: params.target || '',
            };
            return {
              ...node,
              data: {
                ...routerData,
                choices,
              } as RouterNodeData,
            };
          }
          return node;
        });
        setNodes(updatedNodes);
      }
      
      const newEdge: FlowEdge = {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target || '',
        type: 'default',
      };
      setEdges([...edges, newEdge]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const addNode = (selectedComponentType: ComponentType) => {
    const newNode: FlowNode = {
      id: (nodes.length + 1).toString(),
      type: selectedComponentType,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: getInitialDataForType(selectedComponentType, nodes.length),
    };
    setNodes([...nodes, newNode]);
  };

  return {
    saveChanges,
    onConnect,
    addNode,
  };
};
