
import { Button } from "@/components/ui/button";
import { Condition, ConditionType, ActionType } from "@/types/conditions";
import { ModuleVariable } from "@/types/module";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Minus, Plus, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RouterConditionsProps {
  conditions: Condition[];
  variables: ModuleVariable[];
  onAddCondition: () => void;
  onDeleteCondition: (conditionId: string) => void;
}

const CONDITION_TYPES: { value: ConditionType; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' },
  { value: 'in_array', label: 'In Array' },
  { value: 'not_in_array', label: 'Not In Array' },
];

const ACTION_TYPES: { value: ActionType; label: string }[] = [
  { value: 'set_variable', label: 'Set Variable' },
  { value: 'increment', label: 'Increment' },
  { value: 'decrement', label: 'Decrement' },
  { value: 'append_to_array', label: 'Append to Array' },
  { value: 'remove_from_array', label: 'Remove from Array' },
  { value: 'clear_array', label: 'Clear Array' },
];

export function RouterConditions({
  conditions,
  variables,
  onAddCondition,
  onDeleteCondition,
}: RouterConditionsProps) {
  if (!variables || variables.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground p-4 border rounded">
        <AlertCircle className="h-4 w-4" />
        <span>No variables available. Create variables first to add conditions.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Conditions</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddCondition}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a new condition</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {conditions.length === 0 ? (
          <div className="text-center text-muted-foreground p-4 border rounded">
            No conditions added yet. Click the Add button to create your first condition.
          </div>
        ) : (
          conditions.map((condition) => (
            <Card key={condition.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select defaultValue={condition.target_variable_id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select variable" />
                      </SelectTrigger>
                      <SelectContent>
                        {variables.map((variable) => (
                          <SelectItem key={variable.id} value={variable.id}>
                            {variable.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Select defaultValue={condition.condition_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Input 
                      placeholder="Value"
                      defaultValue={condition.condition_value}
                      className="w-full"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCondition(condition.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select defaultValue={condition.action_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Input 
                      placeholder="Action value"
                      defaultValue={condition.action_value}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
