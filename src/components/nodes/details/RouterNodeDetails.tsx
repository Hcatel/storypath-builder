
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { RouterNodeData } from "@/types/module";

type RouterNodeDetailsProps = {
  data: RouterNodeData;
  onUpdate: (updates: Partial<RouterNodeData>) => void;
};

export function RouterNodeDetails({ data, onUpdate }: RouterNodeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Question</label>
        <Input
          value={data.question}
          onChange={(e) => onUpdate({ ...data, question: e.target.value })}
          placeholder="Enter the decision question"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Choices</label>
        {data.choices.map((choice, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={choice.text}
              onChange={(e) => {
                const newChoices = [...data.choices];
                newChoices[index] = { ...choice, text: e.target.value };
                onUpdate({ ...data, choices: newChoices });
              }}
              placeholder={`Choice ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newChoices = data.choices.filter((_, i) => i !== index);
                onUpdate({ ...data, choices: newChoices });
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newChoices = [...data.choices, { text: '', nextComponentId: '' }];
            onUpdate({ ...data, choices: newChoices });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Choice
        </Button>
      </div>
    </div>
  );
}
