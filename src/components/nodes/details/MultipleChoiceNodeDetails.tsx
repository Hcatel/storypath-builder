
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultipleChoiceNodeData } from "@/types/module";
import { Plus, X } from "lucide-react";

type MultipleChoiceNodeDetailsProps = {
  data: MultipleChoiceNodeData;
  onUpdate: (updates: Partial<MultipleChoiceNodeData>) => void;
};

export function MultipleChoiceNodeDetails({ data, onUpdate }: MultipleChoiceNodeDetailsProps) {
  const addOption = () => {
    const newOptions = [...(data.options || []), "New option"];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = data.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...data.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Question</Label>
        <Input
          value={data.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question"
        />
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {data.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="allow-multiple"
          checked={data.allowMultiple}
          onCheckedChange={(checked) => onUpdate({ allowMultiple: checked })}
        />
        <Label htmlFor="allow-multiple">Allow multiple selections</Label>
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
