
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterNodeData } from "@/types/module";
import { GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRouterConditions } from "@/hooks/useRouterConditions";
import { useModuleVariables } from "@/hooks/useModuleVariables";
import { useLearnerState } from "@/hooks/useLearnerState";
import { evaluateChoiceConditions } from "@/utils/conditionEvaluator";

type RouterNodeProps = {
  data: RouterNodeData;
  selected?: boolean;
  id: string;
};

export function RouterNode({ data, selected, id }: RouterNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  const { id: moduleId } = useParams();
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: conditions } = useRouterConditions(id);
  const { data: variables } = useModuleVariables(moduleId);
  const { learnerState, isLoading: isStateLoading } = useLearnerState(moduleId, user?.id);

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

  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  if (isStateLoading) {
    return <div>Loading state...</div>;
  }

  if (!data.choices || !Array.isArray(data.choices)) {
    console.error("RouterNode: Invalid choices data", data);
    return null;
  }

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
            const isValid = evaluateChoiceConditions(index, conditions, variables, learnerState);
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
