
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInputNodeData } from "@/types/module";
import { FormInput } from "lucide-react";

type TextInputNodeProps = {
  data: TextInputNodeData;
  selected?: boolean;
};

export function TextInputNode({ data, selected }: TextInputNodeProps) {
  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FormInput className="w-4 h-4" />
          Text Input
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground truncate">{data.question || "Enter your question"}</p>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
