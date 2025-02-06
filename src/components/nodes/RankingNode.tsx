import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingNodeData } from "@/types/module";

type RankingNodeProps = {
  data: RankingNodeData;
  selected?: boolean;
};

export function RankingNode({ data, selected }: RankingNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">{data.title || "Ranking"}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.options && data.options.length > 0 ? (
          <div className="space-y-2">
            {data.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium">{index + 1}.</span>
                <span className="text-sm text-muted-foreground">{option}</span>
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