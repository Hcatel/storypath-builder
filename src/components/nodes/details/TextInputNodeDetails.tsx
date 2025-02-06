
import { Input } from "@/components/ui/input";
import { TextInputNodeData } from "@/types/module";

type TextInputNodeDetailsProps = {
  data: TextInputNodeData;
  onUpdate: (updates: Partial<TextInputNodeData>) => void;
};

export function TextInputNodeDetails({ data, onUpdate }: TextInputNodeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Question</label>
        <Input
          value={data.question}
          onChange={(e) => onUpdate({ ...data, question: e.target.value })}
          placeholder="Enter your question"
        />
      </div>
    </div>
  );
}
