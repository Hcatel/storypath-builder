
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageNodeData } from "@/types/module";

type MessageNodeDetailsProps = {
  data: MessageNodeData;
  onUpdate: (updates: Partial<MessageNodeData>) => void;
};

export function MessageNodeDetails({ data, onUpdate }: MessageNodeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="Enter message title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={data.content}
          onChange={(e) => onUpdate({ ...data, content: e.target.value })}
          placeholder="Enter message content"
        />
      </div>
    </div>
  );
}
