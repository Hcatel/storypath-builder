
export type ConditionType = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'starts_with' | 'ends_with' | 'in_array' | 'not_in_array';

export type ActionType = 'set_variable' | 'increment' | 'decrement' | 'append_to_array' | 'remove_from_array' | 'clear_array';

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
  created_at?: string;
  updated_at?: string;
}
