
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultipleChoiceNodeData } from "@/types/module";
import { ListChecks } from "lucide-react";

type MultipleChoiceNodeProps = {
  data: MultipleChoiceNodeData;
  selected?: boolean;
};

export function MultipleChoiceNode({ data, selected }: MultipleChoiceNodeProps) {
  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ListChecks className="w-4 h-4" />
          Multiple Choice
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs font-medium truncate">{data.question || "Enter question"}</p>
        {data.options && data.options.length > 0 ? (
          <div className="mt-2 space-y-1">
            {data.options.slice(0, 2).map((option, index) => (
              <div key={index} className="text-[10px] p-1 bg-muted rounded truncate">
                {option}
              </div>
            ))}
            {data.options.length > 2 && (
              <div className="text-[10px] text-muted-foreground">
                +{data.options.length - 2} more options
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground mt-2">No options added</div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
