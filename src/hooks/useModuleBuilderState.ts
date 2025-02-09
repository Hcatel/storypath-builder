
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNodesState, useEdgesState } from '@xyflow/react';
import { FlowNode, FlowEdge } from "@/types/module";
import { getInitialNode } from "@/constants/moduleComponents";
import { convertToReactFlowNode } from "@/utils/nodeConverters";
import { Database } from "@/integrations/supabase/types";

type ModuleRow = Database['public']['Tables']['modules']['Row'];
type ModuleEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
};

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
        .single();

      if (error) {
        console.error("Error fetching module:", error);
        throw error;
      }
      
      // Ensure nodes and edges are arrays and properly typed
      const moduleNodes = Array.isArray(data?.nodes) ? data.nodes : [];
      const moduleEdges = Array.isArray(data?.edges) ? data.edges as ModuleEdge[] : [];

      const convertedNodes = moduleNodes.map(node => convertToReactFlowNode(node));
      const convertedEdges = moduleEdges.map(edge => ({
        id: String(edge.id || ''),
        source: String(edge.source || ''),
        target: String(edge.target || ''),
        type: String(edge.type || 'default'),
        data: edge.data || {},
      })) as FlowEdge[];

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
