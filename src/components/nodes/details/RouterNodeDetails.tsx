
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RouterNodeData, NodeData } from "@/types/module";
import { Node } from "@xyflow/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Condition } from "@/types/conditions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RouterChoice } from "./router/RouterChoice";
import { RouterConditions } from "./router/RouterConditions";

type RouterNodeDetailsProps = {
  data: RouterNodeData;
  onUpdate: (updates: Partial<RouterNodeData>) => void;
  availableNodes: Node<NodeData>[];
};

export function RouterNodeDetails({ data, onUpdate, availableNodes }: RouterNodeDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showConditionDialog, setShowConditionDialog] = useState(false);

  const { data: variables } = useQuery({
    queryKey: ["module-variables", data.moduleId],
    queryFn: async () => {
      const { data: variables, error } = await supabase
        .from("module_variables")
        .select("*")
        .eq("module_id", data.moduleId as string);

      if (error) throw error;
      return variables;
    },
  });

  const { data: conditions } = useQuery({
    queryKey: ["module-conditions", data.id],
    queryFn: async () => {
      const { data: conditions, error } = await supabase
        .from("module_conditions")
        .select("*")
        .eq("source_node_id", data.id as string)
        .order("priority", { ascending: true });

      if (error) throw error;
      return conditions as Condition[];
    },
  });

  const { mutate: createCondition } = useMutation({
    mutationFn: async (condition: Omit<Condition, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("module_conditions")
        .insert([condition])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-conditions", data.id] });
      toast({
        title: "Condition created",
        description: "New condition has been added successfully",
      });
      setShowConditionDialog(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create condition: " + error.message,
      });
    },
  });

  const { mutate: deleteCondition } = useMutation({
    mutationFn: async (conditionId: string) => {
      const { error } = await supabase
        .from("module_conditions")
        .delete()
        .eq("id", conditionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-conditions", data.id] });
      toast({
        title: "Condition deleted",
        description: "Condition has been removed successfully",
      });
    },
  });

  const handleChoiceUpdate = (index: number, updates: { text?: string; nextComponentId?: string }) => {
    const newChoices = [...data.choices];
    newChoices[index] = { ...newChoices[index], ...updates };
    onUpdate({ ...data, choices: newChoices });
  };

  const handleAddCondition = () => {
    if (selectedChoice !== null && variables && variables.length > 0) {
      createCondition({
        module_id: data.moduleId as string,
        source_node_id: data.id,
        target_variable_id: variables[0].id,
        condition_type: 'equals',
        condition_value: "",
        action_type: 'set_variable',
        action_value: "",
        priority: conditions?.length || 0,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Question</label>
        <Input
          value={data.question}
          onChange={(e) => onUpdate({ ...data, question: e.target.value })}
          placeholder="Enter the decision question"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Choices</label>
        {data.choices.map((choice, index) => (
          <RouterChoice
            key={index}
            choice={choice}
            index={index}
            availableNodes={availableNodes}
            onUpdate={handleChoiceUpdate}
            onDelete={() => {
              const newChoices = data.choices.filter((_, i) => i !== index);
              onUpdate({ ...data, choices: newChoices });
            }}
            onConfigureConditions={() => {
              setSelectedChoice(index);
              setShowConditionDialog(true);
            }}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newChoices = [...data.choices, { text: '', nextComponentId: '' }];
            onUpdate({ ...data, choices: newChoices });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Choice
        </Button>
      </div>

      <Dialog open={showConditionDialog} onOpenChange={setShowConditionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configure Conditions for Choice {selectedChoice !== null ? selectedChoice + 1 : ''}
            </DialogTitle>
          </DialogHeader>
          <RouterConditions
            conditions={conditions || []}
            variables={variables || []}
            onAddCondition={handleAddCondition}
            onDeleteCondition={deleteCondition}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
