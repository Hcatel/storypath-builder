
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModuleStatusToggle } from "@/components/modules/share/ModuleStatusToggle";
import { ModuleAccessControl } from "@/components/modules/share/ModuleAccessControl";
import { ModuleShareLink } from "@/components/modules/share/ModuleShareLink";

type ModuleAccessType = 'private' | 'public';

export default function SharePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isCreateMode = !id || id === 'create';

  // Fetch module data
  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        return {
          access_type: 'private' as ModuleAccessType,
          published: false,
          id: 'create'
        };
      }

      console.log('Fetching module data for ID:', id);
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error('Error fetching module:', error);
        throw error;
      }

      console.log('Fetched module data:', data);
      return data;
    },
    enabled: !!id,
  });

  const handleRefetch = async () => {
    console.log('Invalidating module query...');
    await queryClient.invalidateQueries({ queryKey: ["module", id] });
  };

  if (isLoading && !isCreateMode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Share & Access</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Status</CardTitle>
          <CardDescription>
            Control the visibility and publish status of your module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ModuleStatusToggle
            moduleId={id || 'create'}
            published={module?.published || false}
            isCreateMode={isCreateMode}
            onStatusChange={handleRefetch}
          />

          <ModuleAccessControl
            moduleId={id || 'create'}
            accessType={module?.access_type || 'private'}
            isCreateMode={isCreateMode}
            onAccessChange={handleRefetch}
          />
        </CardContent>
      </Card>

      {!isCreateMode && (
        <ModuleShareLink moduleId={id || ''} />
      )}
    </div>
  );
}
