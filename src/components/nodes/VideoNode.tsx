
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoNodeData } from "@/types/module";
import { Video } from "lucide-react";

type VideoNodeProps = {
  data: VideoNodeData;
  selected?: boolean;
};

export function VideoNode({ data, selected }: VideoNodeProps) {
  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="w-4 h-4" />
          {data.title || "Video"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
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
              <Video className="w-4 h-4" />
            </div>
          )}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
