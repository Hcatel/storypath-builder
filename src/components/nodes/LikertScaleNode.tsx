
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { LikertScaleNodeData } from "@/types/module";

type LikertScaleNodeProps = {
  data: LikertScaleNodeData;
  selected?: boolean;
};

export function LikertScaleNode({ data, selected }: LikertScaleNodeProps) {
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
              <span>{data.startText}</span>
              <span>{data.middleText}</span>
              <span>{data.endText}</span>
            </div>
          </div>
        );
      
      case 'stars':
        return (
          <div className="flex justify-between">
            {Array.from({ length: data.scaleEnd - data.scaleStart + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Star className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs">{data.labels?.[data.scaleStart + i] || ""}</span>
              </div>
            ))}
          </div>
        );
      
      default: // 'numbers'
        return (
          <div className="flex justify-between">
            {Array.from({ length: data.scaleEnd - data.scaleStart + 1 }, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-muted">
                  <span className="text-sm font-medium">{data.scaleStart + i}</span>
                </div>
                <span className="text-xs text-muted-foreground">
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
      <CardHeader>
        <CardTitle className="text-sm">Likert Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-4">{data.question || "Enter your question"}</p>
        {renderScale()}
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
