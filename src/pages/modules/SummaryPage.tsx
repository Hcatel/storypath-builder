
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModuleDetails } from "@/components/modules/ModuleDetails";
import { ModuleStatus } from "@/components/modules/ModuleStatus";

export default function SummaryPage() {
  const { id } = useParams();
  const { toast } = useToast();

  // Fetch module data
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update module mutation
  const { mutate: updateModule } = useMutation({
    mutationFn: async (values: {
      title?: string;
      description?: string;
      thumbnail_url?: string;
    }) => {
      const { error } = await supabase
        .from("modules")
        .update(values)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module updated successfully",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update module: " + error.message,
      });
    },
  });

  // Check for errors function
  const checkForErrors = () => {
    const errors = [];

    if (!module?.title) {
      errors.push("Module title is required");
    }

    if (!module?.nodes || !Array.isArray(module.nodes) || module.nodes.length === 0) {
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
    updateModule({
      title: module?.title,
      description: module?.description
    });
  };

  if (isLoading) {
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

      <div className="grid gap-6 md:grid-cols-2">
        <ModuleDetails
          moduleId={id || ""}
          title={module?.title || ""}
          description={module?.description || ""}
          thumbnailUrl={module?.thumbnail_url}
          onUpdate={updateModule}
        />
        <ModuleStatus
          published={module?.published || false}
          accessType={module?.access_type || "private"}
        />
      </div>
    </div>
  );
}
