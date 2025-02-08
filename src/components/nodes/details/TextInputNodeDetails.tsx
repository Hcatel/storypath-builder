
import { Input } from "@/components/ui/input";
import { TextInputNodeData } from "@/types/module";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={data.isRequired}
          onCheckedChange={(checked) => onUpdate({ isRequired: checked })}
        />
        <Label htmlFor="required">Required</Label>
      </div>
    </div>
  );
}
