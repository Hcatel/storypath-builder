
import { Condition } from "@/types/conditions";

export function evaluateCondition(condition: Condition, variableValue: any): boolean {
  // If it's an advanced expression, evaluate it differently
  if (condition.expression_type === 'advanced' && condition.custom_expression) {
    try {
      // For now, we'll use a simple evaluation. In the future, this could be expanded
      // to use a proper expression evaluator
      return Boolean(eval(condition.custom_expression));
    } catch (error) {
      console.error('Failed to evaluate custom expression:', error);
      return false;
    }
  }

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

  // Group conditions by their group ID
  const groupedConditions = conditions.reduce((acc, condition) => {
    if (condition.action_type === 'set_variable' && 
        condition.action_value === choiceIndex.toString()) {
      const groupId = condition.condition_group_id || 'default';
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(condition);
    }
    return acc;
  }, {} as Record<string, Condition[]>);

  // Evaluate each group
  return Object.values(groupedConditions).every(groupConditions => {
    return groupConditions.reduce((result, currentCondition) => {
      const variable = variables?.find(v => v.id === currentCondition.target_variable_id);
      if (!variable) return false;

      const variableValue = learnerState?.variables_state?.[variable.id] ?? variable.default_value;
      const conditionResult = evaluateCondition(currentCondition, variableValue);

      if (currentCondition.condition_operator === 'AND') {
        return result && conditionResult;
      } else {
        return result || conditionResult;
      }
    }, currentCondition.condition_operator === 'AND');
  });
}
