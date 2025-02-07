
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterNodeData } from "@/types/module";
import { GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Condition } from "@/types/conditions";

type RouterNodeProps = {
  data: RouterNodeData;
  selected?: boolean;
  id: string;
};

export function RouterNode({ data, selected, id }: RouterNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  const { id: moduleId } = useParams();
  
  // Fetch conditions for this router node
  const { data: conditions } = useQuery({
    queryKey: ["module-conditions", id],
    queryFn: async () => {
      const { data: conditions, error } = await supabase
        .from("module_conditions")
        .select("*")
        .eq("source_node_id", id)
        .order("priority", { ascending: true });

      if (error) throw error;
      return conditions as Condition[];
    },
  });

  // Fetch variables for this module
  const { data: variables } = useQuery({
    queryKey: ["module-variables", moduleId],
    queryFn: async () => {
      const { data: variables, error } = await supabase
        .from("module_variables")
        .select("*")
        .eq("module_id", moduleId as string);

      if (error) throw error;
      return variables;
    },
  });

  // Fetch current learner state
  const { data: learnerState } = useQuery({
    queryKey: ["learner-state", moduleId],
    queryFn: async () => {
      const { data: state, error } = await supabase
        .from("learner_module_states")
        .select("*")
        .eq("module_id", moduleId as string)
        .maybeSingle();

      if (error) throw error;
      return state;
    },
  });

  useEffect(() => {
    if (!data.moduleId && moduleId) {
      setNodes(nodes => 
        nodes.map(node => 
          node.id === id 
            ? { ...node, data: { ...node.data, moduleId } }
            : node
        )
      );
    }
  }, [data.moduleId, moduleId, id, setNodes]);
  
  const evaluateCondition = (condition: Condition, variableValue: any): boolean => {
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
  };

  const evaluateChoiceConditions = (choiceIndex: number, variables: any) => {
    if (!conditions) return true;

    const choiceConditions = conditions.filter(c => 
      c.action_type === 'set_variable' && 
      c.action_value === choiceIndex.toString()
    );

    // If no conditions are set for this choice, it's always valid
    if (choiceConditions.length === 0) return true;

    // Evaluate all conditions for this choice
    return choiceConditions.every(condition => {
      const variable = variables?.find(v => v.id === condition.target_variable_id);
      if (!variable) return false;

      // Get variable value from learner state if available, otherwise use default
      const variableValue = learnerState?.variables_state?.[variable.id] ?? variable.default_value;
      return evaluateCondition(condition, variableValue);
    });
  };

  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Decision Router
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs font-medium truncate">{data.question}</p>
        <div className="mt-2 space-y-1">
          {data.choices.map((choice, index) => {
            const isValid = evaluateChoiceConditions(index, variables);
            return (
              <div 
                key={index} 
                className={`text-[10px] ${isValid ? 'text-muted-foreground' : 'text-red-500'} truncate`}
              >
                • {choice.text}
              </div>
            );
          })}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      {data.choices.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`choice-${index}`}
          style={{ top: `${((index + 1) / (data.choices.length + 1)) * 100}%` }}
        />
      ))}
    </Card>
  );
}
