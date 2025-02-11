
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalModuleState } from "@/hooks/useModuleData";
import { RouterNodeData } from "@/types/module";

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

    // Check router nodes validation
    const routerNodes = localModule?.nodes?.filter(node => node.data.type === 'router') || [];
    routerNodes.forEach(node => {
      const routerData = node.data as RouterNodeData;
      if (!routerData.choices || routerData.choices.length < 2) {
        errors.push(`Router node "${routerData.label}" must have at least two choices`);
      }
      if (routerData.choices?.some(choice => !choice.nextNodeId)) {
        errors.push(`Router node "${routerData.label}" has choices without connected nodes`);
      }
    });

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
      return false;
    }

    toast({
      title: "Success",
      description: "No errors found in your module",
    });
    return true;
  };

  const handleSave = () => {
    if (checkForErrors()) {
      onSave();
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={checkForErrors} variant="outline">
        Check for Errors
      </Button>
      <Button onClick={handleSave}>
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}
