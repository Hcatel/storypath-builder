
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingNodeData } from "@/types/module";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RankingNodeProps = {
  data: RankingNodeData;
  selected?: boolean;
  id: string;
};

export function RankingNode({ data, selected, id }: RankingNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  
  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{data.title || "Ranking"}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      {data.instructions && (
        <p className="px-6 text-sm text-muted-foreground">{data.instructions}</p>
      )}
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
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
