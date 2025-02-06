
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoNodeData } from "@/types/module";

type VideoNodeProps = {
  data: VideoNodeData;
  selected?: boolean;
};

export function VideoNode({ data, selected }: VideoNodeProps) {
  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-sm">{data.title || "Video"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md">
          {data.videoUrl ? (
            <iframe 
              src={data.videoUrl} 
              className="w-full h-full rounded-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No video URL set
            </div>
          )}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
}
