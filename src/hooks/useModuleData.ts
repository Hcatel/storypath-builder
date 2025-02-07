
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export type ModuleAccessType = 'private' | 'public' | 'restricted';

export interface LocalModuleState {
  title: string;
  description: string;
  thumbnail_url: string | null;
  access_type: ModuleAccessType;
  nodes: any[];
  edges: any[];
  published: boolean;
  component_types: string[];
}

export function useModuleData(id: string | undefined, user: any) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isCreateMode = !id || id === 'create';

  // Fetch module data
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (!id || isCreateMode) {
        return null;
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

      return data;
    },
    enabled: !!user,
  });

  // Update module mutation
  const { mutate: updateModule } = useMutation({
    mutationFn: async (values: {
      title?: string;
      description?: string;
      thumbnail_url?: string;
    }) => {
      if (!user) throw new Error("No user found");

      if (isCreateMode) {
        const { data, error } = await supabase
          .from("modules")
          .insert([{
            title: values.title || "",
            description: values.description || "",
            thumbnail_url: values.thumbnail_url,
            user_id: user.id,
            access_type: "private",
            nodes: [],
            edges: [],
            published: false,
            component_types: [],
          }])
          .select()
          .single();

        if (error) throw error;
        
        navigate(`/modules/${data.id}/summary`);
        return data;
      }
      
      if (!id) throw new Error("No module ID provided");
      
      const { error } = await supabase
        .from("modules")
        .update(values)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module saved successfully",
      });
      refetch();
    },
    onError: (error: any) => {
      console.error("Error updating module:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save module: " + error.message,
      });
    },
  });

  return {
    module,
    isLoading,
    updateModule,
    isCreateMode,
  };
}
