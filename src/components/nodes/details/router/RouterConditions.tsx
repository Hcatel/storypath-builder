
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { Condition } from "@/types/conditions";
import { ModuleVariable } from "@/types/module";

interface RouterConditionsProps {
  conditions: Condition[];
  variables: ModuleVariable[];
  onAddCondition: () => void;
  onDeleteCondition: (conditionId: string) => void;
}

export function RouterConditions({
  conditions,
  variables,
  onAddCondition,
  onDeleteCondition,
}: RouterConditionsProps) {
  if (!variables || variables.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No variables available. Create variables first to add conditions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Existing Conditions</h3>
      <div className="space-y-2">
        {conditions?.map((condition) => (
          <div key={condition.id} className="flex items-center justify-between p-2 border rounded">
            <span className="text-sm">
              {variables.find(v => v.id === condition.target_variable_id)?.name} 
              {' '}{condition.condition_type}{' '}
              {JSON.stringify(condition.condition_value)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteCondition(condition.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={onAddCondition}>
          Add Condition
        </Button>
      </div>
    </div>
  );
}

