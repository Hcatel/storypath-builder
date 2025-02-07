
export type ConditionType = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'starts_with' | 'ends_with' | 'in_array' | 'not_in_array';

export type ActionType = 'set_variable' | 'increment' | 'decrement' | 'append_to_array' | 'remove_from_array' | 'clear_array';

export type ExpressionType = 'simple' | 'advanced';

export type ConditionOperator = 'AND' | 'OR';

export interface Condition {
  id: string;
  module_id: string;
  source_node_id: string;
  target_variable_id: string;
  condition_type: ConditionType;
  condition_value: any;
  action_type: ActionType;
  action_value: any;
  priority: number;
  expression_type: ExpressionType;
  custom_expression?: string;
  condition_group_id?: string;
  condition_operator: ConditionOperator;
  reference_module_id?: string;
  reference_variable_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
