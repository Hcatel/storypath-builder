
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
import { ComponentType } from "@/types/module";
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

  // Fetch module versions
  const { data: versions } = useQuery({
    queryKey: ["module-versions", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("module_versions")
        .select("*")
        .eq("module_id", id)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleVersionChange = async (versionId: string) => {
    const version = versions?.find(v => v.id === versionId);
    if (!version) return;

    try {
      setNodes(version.nodes);
      setEdges(version.edges);
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
    <div className="flex items-center gap-2 p-2">
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
      <Button onClick={onSave} size="sm">
        Save Changes
      </Button>
      {versions && versions.length > 0 && (
        <Select onValueChange={handleVersionChange}>
          <SelectTrigger className="w-[180px] bg-background">
            <History className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Restore version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                Version {version.version_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
