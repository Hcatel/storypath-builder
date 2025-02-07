
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchingNodeData } from "@/types/module";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

type MatchingNodeProps = {
  data: MatchingNodeData;
  selected?: boolean;
};

export function MatchingNode({ data, selected }: MatchingNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">{data.title || "Matching Exercise"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-2">
            {data.pairs && data.pairs.map((pair, index) => (
              <div 
                key={`left-${index}`}
                className="p-2 bg-secondary rounded-md text-sm"
              >
                {pair.left}
              </div>
            ))}
          </div>
          
          {/* Right column */}
          <div className="space-y-2">
            {data.pairs && data.pairs.map((pair, index) => (
              <div 
                key={`right-${index}`}
                className="p-2 bg-secondary rounded-md text-sm"
              >
                {pair.right}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
