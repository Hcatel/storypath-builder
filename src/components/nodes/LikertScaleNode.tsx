
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Star, Trash2 } from "lucide-react";
import { LikertScaleNodeData } from "@/types/module";
import { Button } from "@/components/ui/button";

type LikertScaleNodeProps = {
  data: LikertScaleNodeData;
  selected?: boolean;
  id: string;
};

export function LikertScaleNode({ data, selected, id }: LikertScaleNodeProps) {
  const renderScale = () => {
    switch (data.displayType) {
      case 'slider':
        return (
          <div className="w-full px-4">
            <Slider
              defaultValue={[Math.floor((data.scaleEnd + data.scaleStart) / 2)]}
              min={data.scaleStart}
              max={data.scaleEnd}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{data.startText || data.scaleStart}</span>
              <span>{data.middleText}</span>
              <span>{data.endText || data.scaleEnd}</span>
            </div>
          </div>
        );
      
      case 'stars':
        return (
          <div className="flex justify-center gap-4">
            {Array.from({ length: data.scaleEnd - data.scaleStart + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Star className="w-6 h-6 text-muted-foreground hover:text-yellow-400 cursor-pointer" />
                <span className="text-xs text-muted-foreground">
                  {data.labels?.[data.scaleStart + i] || (data.scaleStart + i)}
                </span>
              </div>
            ))}
          </div>
        );
      
      default: // 'numbers'
        return (
          <div className="flex justify-center gap-4">
            {Array.from({ length: data.scaleEnd - data.scaleStart + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-muted hover:bg-muted/80 cursor-pointer">
                  <span className="text-sm font-medium">{data.scaleStart + i}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {data.labels?.[data.scaleStart + i] || ""}
                </span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Card className={`w-[400px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Likert Scale</CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 p-0"
          onClick={() => {
            const event = new CustomEvent('delete-node', { detail: { id } });
            window.dispatchEvent(event);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-4">{data.question || "Enter your question"}</p>
        {renderScale()}
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
