
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageNodeData } from "@/types/module";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type MessageNodeProps = {
  data: MessageNodeData;
  selected?: boolean;
  id: string;
};

export function MessageNode({ data, selected, id }: MessageNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  
  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {data.title || "Message"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground truncate">{data.content}</p>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
