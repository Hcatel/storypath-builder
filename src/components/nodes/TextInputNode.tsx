
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextInputNodeData } from "@/types/module";
import { FormInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type TextInputNodeProps = {
  data: TextInputNodeData;
  selected?: boolean;
  id: string;
};

export function TextInputNode({ data, selected, id }: TextInputNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  
  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FormInput className="w-4 h-4" />
            Text Input
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
        <p className="text-xs text-muted-foreground truncate">{data.question || "Enter your question"}</p>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
