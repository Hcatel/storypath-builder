
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNodesState, useEdgesState } from '@xyflow/react';
import { FlowNode, FlowEdge } from "@/types/module";
import { getInitialNode } from "@/constants/moduleComponents";
import { convertToReactFlowNode } from "@/utils/nodeConverters";

export function useModuleBuilderState(id: string | undefined) {
  const isCreateMode = !id || id === 'create';

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        return {
          nodes: [],
          edges: [],
        };
      }
      
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching module:", error);
        throw error;
      }
      
      const convertedNodes = Array.isArray(data?.nodes) 
        ? data.nodes.map(convertToReactFlowNode)
        : [];

      const convertedEdges = Array.isArray(data?.edges)
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
    enabled: !isCreateMode,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    module?.nodes || [getInitialNode()]
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(
    module?.edges || []
  );

  return {
    isLoading,
    isCreateMode,
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
  };
}
