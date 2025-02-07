
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ModuleVariablesPanelProps {
  moduleId: string;
}

export function ModuleVariablesPanel({ moduleId }: ModuleVariablesPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newVariable, setNewVariable] = useState({
    name: "",
    var_type: "string",
    description: "",
    default_value: null,
  });

  const { data: variables, isLoading } = useQuery({
    queryKey: ["module-variables", moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_variables")
        .select("*")
        .eq("module_id", moduleId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { mutate: createVariable } = useMutation({
    mutationFn: async (variable: typeof newVariable) => {
      const { data, error } = await supabase
        .from("module_variables")
        .insert([
          {
            ...variable,
            module_id: moduleId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-variables", moduleId] });
      setNewVariable({
        name: "",
        var_type: "string",
        description: "",
        default_value: null,
      });
      toast({
        title: "Variable created",
        description: "New variable has been added successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create variable: " + error.message,
      });
    },
  });

  const { mutate: deleteVariable } = useMutation({
    mutationFn: async (variableId: string) => {
      const { error } = await supabase
        .from("module_variables")
        .delete()
        .eq("id", variableId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-variables", moduleId] });
      toast({
        title: "Variable deleted",
        description: "Variable has been removed successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete variable: " + error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVariable.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Variable name is required",
      });
      return;
    }
    createVariable(newVariable);
  };

  if (isLoading) {
    return <div>Loading variables...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Module Variables</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Variable name"
            value={newVariable.name}
            onChange={(e) =>
              setNewVariable({ ...newVariable, name: e.target.value })
            }
          />
          <Select
            value={newVariable.var_type}
            onValueChange={(value) =>
              setNewVariable({ ...newVariable, var_type: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="array">Array</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add Variable
          </Button>
        </div>
        <Input
          placeholder="Description (optional)"
          value={newVariable.description}
          onChange={(e) =>
            setNewVariable({ ...newVariable, description: e.target.value })
          }
        />
      </form>

      <div className="space-y-2">
        {variables?.map((variable) => (
          <div
            key={variable.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <div className="font-medium">{variable.name}</div>
              <div className="text-sm text-muted-foreground">
                Type: {variable.var_type}
                {variable.description && ` • ${variable.description}`}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteVariable(variable.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
