
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

type ModuleAccessType = 'private' | 'public' | 'restricted';

export default function SharePage() {
  const { id } = useParams();
  const isCreateMode = !id || id === 'create';

  // Fetch module data
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        return {
          access_type: 'private' as ModuleAccessType,
          published: false,
          id: 'create'
        };
      }

      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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
            onStatusChange={refetch}
          />

          <ModuleAccessControl
            moduleId={id || 'create'}
            accessType={module?.access_type || 'private'}
            isCreateMode={isCreateMode}
            onAccessChange={refetch}
          />
        </CardContent>
      </Card>

      {!isCreateMode && (
        <ModuleShareLink moduleId={id || ''} />
      )}
    </div>
  );
}
