
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoNodeData } from "@/types/module";
import { Video, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type VideoNodeProps = {
  data: VideoNodeData;
  selected?: boolean;
  id: string;
};

export function VideoNode({ data, selected, id }: VideoNodeProps) {
  const { setNodes, getNodes } = useReactFlow();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const onDelete = () => {
    setNodes(getNodes().filter(node => node.id !== id));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className={`w-[200px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            {data.title || "Video"}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div 
          className="aspect-video bg-muted rounded-md relative cursor-pointer group"
          onClick={handlePlayPause}
        >
          <video 
            src={data.videoUrl} 
            className="w-full h-full rounded-md"
            muted
            playsInline
            controls={false}
            autoPlay={false}
          />
          {!isPlaying && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 transition-opacity"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
