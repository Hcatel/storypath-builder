
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterNodeData } from "@/types/module";
import { GitBranch } from "lucide-react";

type RouterNodeProps = {
  data: RouterNodeData;
  selected?: boolean;
};

export function RouterNode({ data, selected }: RouterNodeProps) {
  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Decision Router
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
