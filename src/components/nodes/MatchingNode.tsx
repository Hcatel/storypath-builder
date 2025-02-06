import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchingNodeData } from "@/types/module";

type MatchingNodeProps = {
  data: MatchingNodeData;
  selected?: boolean;
};

export function MatchingNode({ data, selected }: MatchingNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">{data.title || "Matching"}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.pairs && data.pairs.length > 0 ? (
          <div className="space-y-2">
            {data.pairs.map((pair, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{pair.left}</span>
                <span className="text-sm">↔</span>
                <span className="text-sm text-muted-foreground">{pair.right}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No pairs added</p>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}