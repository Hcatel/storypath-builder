
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Condition } from "@/types/conditions";

export function useRouterConditionMutations(nodeId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCondition = useMutation({
    mutationFn: async (condition: Omit<Condition, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("module_conditions")
        .insert([condition])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-conditions", nodeId] });
      toast({
        title: "Condition created",
        description: "New condition has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create condition: " + error.message,
      });
    },
  });

  const deleteCondition = useMutation({
    mutationFn: async (conditionId: string) => {
      const { error } = await supabase
        .from("module_conditions")
        .delete()
        .eq("id", conditionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-conditions", nodeId] });
      toast({
        title: "Condition deleted",
        description: "Condition has been removed successfully",
      });
    },
  });

  return { createCondition, deleteCondition };
}

