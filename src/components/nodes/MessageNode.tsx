
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageNodeData } from "@/types/module";
import { MessageCircle } from "lucide-react";

type MessageNodeProps = {
  data: MessageNodeData;
  selected?: boolean;
};

export function MessageNode({ data, selected }: MessageNodeProps) {
  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {data.title || "Message"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground truncate">{data.content}</p>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
