
import { evaluateCondition, evaluateChoiceConditions } from '../conditionEvaluator';
import { Condition } from '@/types/conditions';

describe('conditionEvaluator', () => {
  const defaultCondition: Condition = {
    id: '1',
    module_id: 'test-module',
    source_node_id: 'test-node',
    target_variable_id: 'test-var',
    condition_type: 'equals',
    condition_value: 'test',
    action_type: 'set_variable',
    action_value: 'test',
    priority: 0,
    expression_type: 'simple',
    condition_operator: 'AND'
  };

  describe('evaluateCondition', () => {
    it('evaluates equals condition correctly', () => {
      const condition: Condition = {
        ...defaultCondition,
        condition_type: 'equals',
        condition_value: 'test'
      };

      expect(evaluateCondition(condition, 'test')).toBe(true);
      expect(evaluateCondition(condition, 'other')).toBe(false);
    });

    it('evaluates greater_than condition correctly', () => {
      const condition: Condition = {
        ...defaultCondition,
        condition_type: 'greater_than',
        condition_value: 5
      };

      expect(evaluateCondition(condition, 10)).toBe(true);
      expect(evaluateCondition(condition, 3)).toBe(false);
    });
  });

  describe('evaluateChoiceConditions', () => {
    const defaultVariable = {
      id: 'test-var',
      module_id: 'test-module',
      name: 'testVar',
      var_type: 'string' as const,
      default_value: ''
    };

    it('evaluates multiple conditions with AND operator', () => {
      const conditions: Condition[] = [
        {
          ...defaultCondition,
          condition_type: 'equals',
          condition_value: 'test',
          priority: 0
        },
        {
          ...defaultCondition,
          condition_type: 'equals',
          condition_value: 'test',
          priority: 1
        }
      ];

      const variables = [defaultVariable];
      const learnerState = {
        variables_state: {
          'test-var': 'test'
        }
      };

      expect(evaluateChoiceConditions(0, conditions, variables, learnerState)).toBe(true);
    });
  });
});
