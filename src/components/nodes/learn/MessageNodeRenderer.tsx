
import { MessageNodeData } from "@/types/module";

interface MessageNodeRendererProps {
  data: MessageNodeData;
}

export function MessageNodeRenderer({ data }: MessageNodeRendererProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
      <p className="text-lg text-gray-700">{data.content}</p>
    </div>
  );
}
