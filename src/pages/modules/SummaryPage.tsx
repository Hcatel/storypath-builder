
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ModuleDetails } from "@/components/modules/ModuleDetails";
import { ModuleStatus } from "@/components/modules/ModuleStatus";
import { ModuleHeaderActions } from "@/components/modules/ModuleHeaderActions";
import { useModuleData, LocalModuleState } from "@/hooks/useModuleData";

export default function SummaryPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Local state for module data
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

  // Use custom hook for module data management
  const { module, isLoading, updateModule, isCreateMode } = useModuleData(id, user);

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
        <ModuleHeaderActions 
          localModule={localModule}
          onSave={handleSave}
        />
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
