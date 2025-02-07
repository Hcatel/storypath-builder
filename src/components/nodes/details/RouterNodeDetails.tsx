
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RouterNodeData, NodeData } from "@/types/module";
import { Node } from "@xyflow/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RouterChoices } from "./router/RouterChoices";
import { RouterConditions } from "./router/RouterConditions";
import { useModuleVariables } from "@/hooks/useModuleVariables";
import { useRouterConditions } from "@/hooks/useRouterConditions";
import { useRouterConditionMutations } from "@/hooks/useRouterConditionMutations";
import { useToast } from "@/hooks/use-toast";

type RouterNodeDetailsProps = {
  data: RouterNodeData;
  onUpdate: (updates: Partial<RouterNodeData>) => void;
  availableNodes: Node<NodeData>[];
};

export function RouterNodeDetails({ data, onUpdate, availableNodes }: RouterNodeDetailsProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showConditionDialog, setShowConditionDialog] = useState(false);
  const { toast } = useToast();

  // Ensure moduleId and nodeId are strings and exist
  const moduleId = data.moduleId as string;
  const nodeId = data.id;

  if (!nodeId || !moduleId) {
    console.error("Missing required IDs:", { nodeId, moduleId });
    return (
      <div className="p-4 text-red-500">
        Error: Missing required node or module ID
      </div>
    );
  }

  const { data: variables } = useModuleVariables(moduleId);
  const { data: conditions } = useRouterConditions(nodeId);
  const { createCondition, deleteCondition } = useRouterConditionMutations(nodeId);

  const handleAddCondition = () => {
    if (selectedChoice === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a choice first",
      });
      return;
    }

    if (!variables || variables.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No variables available. Please create variables first.",
      });
      return;
    }

    createCondition.mutate({
      module_id: moduleId,
      source_node_id: nodeId,
      target_variable_id: variables[0].id,
      condition_type: 'equals',
      condition_value: "",
      action_type: 'set_variable',
      action_value: selectedChoice.toString(),
      priority: conditions?.length || 0,
      condition_operator: 'AND',
      expression_type: 'simple'
    });
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

      <RouterChoices
        data={data}
        availableNodes={availableNodes}
        onUpdate={onUpdate}
        onConfigureConditions={(index) => {
          setSelectedChoice(index);
          setShowConditionDialog(true);
        }}
      />

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
            onDeleteCondition={(conditionId) => deleteCondition.mutate(conditionId)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
