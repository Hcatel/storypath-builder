
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterNodeData } from "@/types/module";
import { GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

type RouterNodeProps = {
  data: RouterNodeData;
  selected?: boolean;
  id: string;
};

export function RouterNode({ data, selected, id }: RouterNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  const { id: moduleId } = useParams();
  
  // Add moduleId to the node data if it's not already present
  if (!data.moduleId && moduleId) {
    setNodes(nodes => 
      nodes.map(node => 
        node.id === id 
          ? { ...node, data: { ...node.data, moduleId } }
          : node
      )
    );
  }
  
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
          {data.choices.map((choice, index) => (
            <div key={index} className="text-[10px] text-muted-foreground truncate">
              • {choice.text}
            </div>
          ))}
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
