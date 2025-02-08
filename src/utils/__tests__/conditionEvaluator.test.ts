
import { evaluateCondition, evaluateChoiceConditions } from '../conditionEvaluator';
import { Condition } from '@/types/conditions';

describe('conditionEvaluator', () => {
  describe('evaluateCondition', () => {
    it('evaluates equals condition correctly', () => {
      const condition: Condition = {
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
          id: '1',
          module_id: 'test-module',
          source_node_id: 'test-node',
          target_variable_id: 'test-var',
          condition_type: 'equals',
          condition_value: 'test',
          action_type: 'set_variable',
          action_value: '0',
          priority: 0,
          expression_type: 'simple',
          condition_operator: 'AND'
        },
        {
          id: '2',
          module_id: 'test-module',
          source_node_id: 'test-node',
          target_variable_id: 'test-var',
          condition_type: 'equals',
          condition_value: 'test',
          action_type: 'set_variable',
          action_value: '0',
          priority: 1,
          expression_type: 'simple',
          condition_operator: 'AND'
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
