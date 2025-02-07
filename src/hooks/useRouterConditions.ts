
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Condition } from "@/types/conditions";

export function useRouterConditions(nodeId?: string) {
  return useQuery({
    queryKey: ["module-conditions", nodeId],
    queryFn: async () => {
      if (!nodeId) {
        return [] as Condition[];
      }

      const { data: conditions, error } = await supabase
        .from("module_conditions")
        .select("*")
        .eq("source_node_id", nodeId)
        .order("priority", { ascending: true });

      if (error) throw error;
      return conditions as Condition[];
    },
    enabled: !!nodeId, // Only run query when nodeId is available
  });
}
