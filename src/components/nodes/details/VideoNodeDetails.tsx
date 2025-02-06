
import { Input } from "@/components/ui/input";
import { VideoNodeData } from "@/types/module";

type VideoNodeDetailsProps = {
  data: VideoNodeData;
  onUpdate: (updates: Partial<VideoNodeData>) => void;
};

export function VideoNodeDetails({ data, onUpdate }: VideoNodeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="Enter video title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Video URL</label>
        <Input
          value={data.videoUrl}
          onChange={(e) => onUpdate({ ...data, videoUrl: e.target.value })}
          placeholder="Enter video URL"
        />
      </div>
    </div>
  );
}
