
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalModuleState } from "@/hooks/useModuleData";

interface ModuleHeaderActionsProps {
  localModule: LocalModuleState;
  onSave: () => void;
}

export function ModuleHeaderActions({ localModule, onSave }: ModuleHeaderActionsProps) {
  const { toast } = useToast();

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

  return (
    <div className="flex gap-2">
      <Button onClick={checkForErrors} variant="outline">
        Check for Errors
      </Button>
      <Button onClick={onSave}>
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}
