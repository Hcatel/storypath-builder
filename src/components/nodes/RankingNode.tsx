
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingNodeData } from "@/types/module";
import { GripVertical } from "lucide-react";

type RankingNodeProps = {
  data: RankingNodeData;
  selected?: boolean;
};

export function RankingNode({ data, selected }: RankingNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-base">{data.title || "Ranking"}</CardTitle>
        {data.instructions && (
          <p className="text-sm text-muted-foreground">{data.instructions}</p>
        )}
      </CardHeader>
      <CardContent>
        {data.options && data.options.length > 0 ? (
          <div className="space-y-2">
            {data.options.map((option, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 bg-secondary rounded-md"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No options added</p>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
