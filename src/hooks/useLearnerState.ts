
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useLearnerState(moduleId?: string, userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: learnerState, isLoading } = useQuery({
    queryKey: ["learner-state", moduleId],
    queryFn: async () => {
      if (!userId || !moduleId) throw new Error("User or module ID not available");

      const { data: existingState, error: fetchError } = await supabase
        .from("learner_module_states")
        .select("*")
        .eq("module_id", moduleId)
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingState) {
        const { data: newState, error: insertError } = await supabase
          .from("learner_module_states")
          .insert({
            module_id: moduleId,
            user_id: userId,
            variables_state: {},
            history: [],
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newState;
      }

      return existingState;
    },
    enabled: !!moduleId && !!userId,
  });

  const { mutate: updateState } = useMutation({
    mutationFn: async (updates: { variables_state: any }) => {
      if (!userId || !moduleId) throw new Error("User or module ID not available");
      
      const { error } = await supabase
        .from("learner_module_states")
        .update(updates)
        .eq("module_id", moduleId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-state", moduleId] });
      toast({
        title: "State updated",
        description: "Your progress has been saved",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update state: " + error.message,
      });
    },
  });

  return { learnerState, isLoading, updateState };
}
