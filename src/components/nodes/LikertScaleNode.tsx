import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LikertScaleNodeData } from "@/types/module";

type LikertScaleNodeProps = {
  data: LikertScaleNodeData;
  selected?: boolean;
};

export function LikertScaleNode({ data, selected }: LikertScaleNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">Likert Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-4">{data.question || "Enter your question"}</p>
        <div className="flex justify-between">
          {Array.from({ length: data.scaleEnd - data.scaleStart + 1 }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-sm font-medium">{data.scaleStart + i}</span>
              <span className="text-xs text-muted-foreground">
                {data.labels?.[data.scaleStart + i] || ""}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}