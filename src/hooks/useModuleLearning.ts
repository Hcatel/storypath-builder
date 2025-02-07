
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlowNode, FlowEdge } from "@/types/module";

export function useModuleLearning(id: string | undefined, userId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: module, isLoading: isModuleLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load module",
          variant: "destructive",
        });
        throw error;
      }

      if (data) {
        const nodes = (data.nodes as unknown) as FlowNode[];
        const edges = (data.edges as unknown) as FlowEdge[];

        return {
          ...data,
          nodes,
          edges,
        };
      }

      return null;
    },
  });

  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["learner-progress", id],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("learner_progress")
        .select("*")
        .eq("module_id", id)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      return data;
    },
    enabled: !!userId && !!id,
  });

  const { mutate: updateProgress } = useMutation({
    mutationFn: async (nodeId: string) => {
      if (!userId || !id) return;

      const completedNodes = progress?.completed_nodes || [];
      if (!completedNodes.includes(nodeId)) {
        completedNodes.push(nodeId);
      }

      const { error } = await supabase
        .from("learner_progress")
        .upsert(
          {
            user_id: userId,
            module_id: id,
            current_node_id: nodeId,
            completed_nodes: completedNodes,
          },
          {
            onConflict: 'user_id,module_id',
          }
        );

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-progress", id] });
    },
  });

  return {
    module,
    isModuleLoading,
    progress,
    isProgressLoading,
    updateProgress,
  };
}
