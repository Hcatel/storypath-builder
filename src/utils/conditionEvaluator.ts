
import { Condition } from "@/types/conditions";

export function evaluateCondition(condition: Condition, variableValue: any): boolean {
  const value = condition.condition_value;
  
  switch (condition.condition_type) {
    case 'equals':
      return variableValue === value;
    case 'not_equals':
      return variableValue !== value;
    case 'greater_than':
      return Number(variableValue) > Number(value);
    case 'less_than':
      return Number(variableValue) < Number(value);
    case 'contains':
      return String(variableValue).includes(String(value));
    case 'starts_with':
      return String(variableValue).startsWith(String(value));
    case 'ends_with':
      return String(variableValue).endsWith(String(value));
    case 'in_array':
      return Array.isArray(value) && value.includes(variableValue);
    case 'not_in_array':
      return Array.isArray(value) && !value.includes(variableValue);
    default:
      return false;
  }
}

export function evaluateChoiceConditions(
  choiceIndex: number,
  conditions: Condition[] | undefined,
  variables: any[] | undefined,
  learnerState: any
): boolean {
  if (!conditions) return true;

  const choiceConditions = conditions.filter(c => 
    c.action_type === 'set_variable' && 
    c.action_value === choiceIndex.toString()
  );

  if (choiceConditions.length === 0) return true;

  return choiceConditions.every(condition => {
    const variable = variables?.find(v => v.id === condition.target_variable_id);
    if (!variable) return false;

    const variableValue = learnerState?.variables_state?.[variable.id] ?? variable.default_value;
    return evaluateCondition(condition, variableValue);
  });
}
