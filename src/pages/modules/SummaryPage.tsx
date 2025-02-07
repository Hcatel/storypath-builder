
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModuleDetails } from "@/components/modules/ModuleDetails";
import { ModuleStatus } from "@/components/modules/ModuleStatus";
import { useAuth } from "@/contexts/AuthContext";

type ModuleAccessType = 'private' | 'public' | 'restricted';

interface LocalModuleState {
  title: string;
  description: string;
  thumbnail_url: string | null;
  access_type: ModuleAccessType;
  nodes: any[];
  edges: any[];
  published: boolean;
  component_types: string[];
}

export default function SummaryPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isCreateMode = !id || id === 'create';
  
  // Local state for module data with proper typing
  const [localModule, setLocalModule] = useState<LocalModuleState>({
    title: "",
    description: "",
    thumbnail_url: null,
    access_type: "private",
    nodes: [],
    edges: [],
    published: false,
    component_types: [],
  });

  // Fetch module data only in edit mode
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

  // Update local state when module data changes
  useEffect(() => {
    if (module) {
      setLocalModule({
        title: module.title || "",
        description: module.description || "",
        thumbnail_url: module.thumbnail_url,
        access_type: module.access_type || "private",
        nodes: Array.isArray(module.nodes) ? module.nodes : [],
        edges: Array.isArray(module.edges) ? module.edges : [],
        published: module.published || false,
        component_types: module.component_types || [],
      });
    }
  }, [module]);

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
        
        // Navigate to the edit page
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

  // Check for errors function
  const checkForErrors = () => {
    const errors = [];

    if (!localModule?.title) {
      errors.push("Module title is required");
    }

    if (!localModule?.nodes || !Array.isArray(localModule?.nodes) || localModule?.nodes.length === 0) {
      errors.push("Module must have at least one content node");
    }

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Module has errors",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
    } else {
      toast({
        title: "Success",
        description: "No errors found in your module",
      });
    }
  };

  const handleSave = () => {
    const updates = {
      title: localModule?.title,
      description: localModule?.description,
      thumbnail_url: localModule?.thumbnail_url
    };
    updateModule(updates);
  };

  // Handler for local updates
  const handleLocalUpdate = (values: {
    title?: string;
    description?: string;
    thumbnail_url?: string;
  }) => {
    setLocalModule(prev => ({
      ...prev,
      ...values
    }));
  };

  if (isLoading && !isCreateMode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Module Summary</h1>
        <div className="flex gap-2">
          <Button onClick={checkForErrors} variant="outline">
            Check for Errors
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <ModuleDetails
          moduleId={id || ""}
          title={localModule?.title || ""}
          description={localModule?.description || ""}
          thumbnailUrl={localModule?.thumbnail_url}
          onUpdate={handleLocalUpdate}
        />
        <ModuleStatus
          published={localModule?.published || false}
          accessType={localModule?.access_type || "private"}
        />
      </div>
    </div>
  );
}
