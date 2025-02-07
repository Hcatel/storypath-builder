
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModuleVariable } from "@/types/module";

export function useModuleVariables(moduleId?: string) {
  return useQuery({
    queryKey: ["module-variables", moduleId],
    queryFn: async () => {
      const { data: variables, error } = await supabase
        .from("module_variables")
        .select("*")
        .eq("module_id", moduleId as string);

      if (error) throw error;
      return variables as ModuleVariable[];
    },
    enabled: !!moduleId,
  });
}
