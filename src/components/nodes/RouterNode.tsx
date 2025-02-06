
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterNodeData } from "@/types/module";

type RouterNodeProps = {
  data: RouterNodeData;
  selected?: boolean;
};

export function RouterNode({ data, selected }: RouterNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">Decision Router</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-2">{data.question}</p>
        <div className="space-y-2">
          {data.choices.map((choice, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              • {choice.text}
            </div>
          ))}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      {data.choices.map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`choice-${index}`}
          style={{ left: `${((index + 1) / (data.choices.length + 1)) * 100}%` }}
        />
      ))}
    </Card>
  );
}
