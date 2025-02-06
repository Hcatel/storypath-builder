
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInputNodeData } from "@/types/module";

type TextInputNodeProps = {
  data: TextInputNodeData;
  selected?: boolean;
};

export function TextInputNode({ data, selected }: TextInputNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">Text Input</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{data.question || "Enter your question"}</p>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
