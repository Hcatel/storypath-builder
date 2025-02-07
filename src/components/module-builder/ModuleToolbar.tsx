
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { componentOptions } from "@/constants/moduleComponents";
import { useReactFlow } from "@xyflow/react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface ModuleToolbarProps {
  selectedComponentType: ComponentType;
  onComponentTypeChange: (value: ComponentType) => void;
  onAddNode: () => void;
  onSave: () => void;
}

export function ModuleToolbar({
  selectedComponentType,
  onComponentTypeChange,
  onAddNode,
  onSave,
}: ModuleToolbarProps) {
  const { id } = useParams();
  const { setNodes, setEdges } = useReactFlow();
  const { toast } = useToast();
  const isCreateMode = !id || id === 'create';

  // Fetch module versions only if we have a valid module ID
  const { data: versions } = useQuery({
    queryKey: ["module-versions", id],
    queryFn: async () => {
      if (!id || isCreateMode) return [];
      
      const { data, error } = await supabase
        .from("module_versions")
        .select("*")
        .eq("module_id", id)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id && !isCreateMode, // Only run query if we have a valid module ID
  });

  const handleVersionChange = async (versionId: string) => {
    const version = versions?.find(v => v.id === versionId);
    if (!version) return;

    try {
      // Type cast the JSON data to the correct types
      const versionNodes = version.nodes as unknown as FlowNode[];
      const versionEdges = version.edges as unknown as FlowEdge[];
      
      setNodes(versionNodes);
      setEdges(versionEdges);
      
      toast({
        title: "Version restored",
        description: `Restored version ${version.version_number}`,
      });
    } catch (error) {
      console.error("Error restoring version:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore version",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <div className="flex items-center gap-2 flex-1">
        <Select
          value={selectedComponentType}
          onValueChange={onComponentTypeChange}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select component type" />
          </SelectTrigger>
          <SelectContent>
            {componentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onAddNode} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Node
        </Button>
        <Button onClick={onSave} size="sm" variant="secondary">
          Save Changes
        </Button>
      </div>

      <div className="flex items-center gap-2 border-l pl-2">
        <History className="w-4 h-4 text-muted-foreground" />
        <Select 
          onValueChange={handleVersionChange} 
          disabled={isCreateMode || !versions?.length}
        >
          <SelectTrigger 
            className="w-[180px] bg-background"
            disabled={isCreateMode || !versions?.length}
          >
            <SelectValue placeholder={isCreateMode ? "No versions available" : "Version history"} />
          </SelectTrigger>
          <SelectContent>
            {versions && versions.length > 0 ? (
              versions.map((version) => (
                <SelectItem key={version.id} value={version.id}>
                  Version {version.version_number} ({new Date(version.created_at).toLocaleDateString()})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-versions" disabled>
                No versions available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
