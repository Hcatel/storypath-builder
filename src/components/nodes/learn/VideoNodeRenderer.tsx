
import { VideoNodeData } from "@/types/module";

interface VideoNodeRendererProps {
  data: VideoNodeData;
}

export function VideoNodeRenderer({ data }: VideoNodeRendererProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{data.title}</h2>
      <div className="aspect-video">
        <iframe
          src={data.videoUrl}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
