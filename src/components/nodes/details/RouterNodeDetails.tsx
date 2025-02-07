
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Settings } from "lucide-react";
import { RouterNodeData, NodeData } from "@/types/module";
import { Node } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Condition, ConditionType, ActionType } from "@/types/conditions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type RouterNodeDetailsProps = {
  data: RouterNodeData;
  onUpdate: (updates: Partial<RouterNodeData>) => void;
  availableNodes: Node[];
};

export function RouterNodeDetails({ data, onUpdate, availableNodes }: RouterNodeDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showConditionDialog, setShowConditionDialog] = useState(false);

  // Fetch module variables for the current module
  const { data: variables } = useQuery({
    queryKey: ["module-variables", data.moduleId],
    queryFn: async () => {
      const { data: variables, error } = await supabase
        .from("module_variables")
        .select("*")
        .eq("module_id", data.moduleId);

      if (error) throw error;
      return variables;
    },
  });

  // Fetch conditions for this router node
  const { data: conditions } = useQuery({
    queryKey: ["module-conditions", data.id],
    queryFn: async () => {
      const { data: conditions, error } = await supabase
        .from("module_conditions")
        .select("*")
        .eq("source_node_id", data.id)
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
          <div key={index} className="space-y-2 border rounded-lg p-3">
            <div className="flex gap-2">
              <Input
                value={choice.text}
                onChange={(e) => {
                  const newChoices = [...data.choices];
                  newChoices[index] = { ...choice, text: e.target.value };
                  onUpdate({ ...data, choices: newChoices });
                }}
                placeholder={`Choice ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newChoices = data.choices.filter((_, i) => i !== index);
                  onUpdate({ ...data, choices: newChoices });
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedChoice(index);
                  setShowConditionDialog(true);
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <label className="text-sm font-medium">Connect to component</label>
              <Select
                value={choice.nextComponentId}
                onValueChange={(value) => {
                  const newChoices = [...data.choices];
                  newChoices[index] = { ...choice, nextComponentId: value };
                  onUpdate({ ...data, choices: newChoices });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a component" />
                </SelectTrigger>
                <SelectContent>
                  {availableNodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {(node.data as NodeData).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
            <DialogTitle>Configure Conditions for Choice {selectedChoice !== null ? selectedChoice + 1 : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {variables && variables.length > 0 ? (
              <div>
                <h3 className="font-medium mb-2">Existing Conditions</h3>
                <div className="space-y-2">
                  {conditions?.filter(c => c.source_node_id === data.id).map((condition) => (
                    <div key={condition.id} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">
                        {variables.find(v => v.id === condition.target_variable_id)?.name} 
                        {' '}{condition.condition_type}{' '}
                        {JSON.stringify(condition.condition_value)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCondition(condition.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => {
                      if (selectedChoice !== null && variables.length > 0) {
                        createCondition({
                          module_id: data.moduleId,
                          source_node_id: data.id,
                          target_variable_id: variables[0].id,
                          condition_type: 'equals',
                          condition_value: "",
                          action_type: 'set_variable',
                          action_value: "",
                          priority: conditions?.length || 0,
                        });
                      }
                    }}
                  >
                    Add Condition
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No variables available. Create variables first to add conditions.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
