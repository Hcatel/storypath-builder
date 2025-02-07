
import { RankingNodeData } from "@/types/module";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";

interface RankingNodeDetailsProps {
  data: RankingNodeData;
  onUpdate: (updates: Partial<RankingNodeData>) => void;
}

export function RankingNodeDetails({ data, onUpdate }: RankingNodeDetailsProps) {
  const addOption = () => {
    const newOptions = [...(data.options || []), "New Option"];
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = data.options?.filter((_, i) => i !== index) || [];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(data.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={data.title || ""}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Instructions</label>
        <Textarea
          value={data.instructions || ""}
          onChange={(e) => onUpdate({ instructions: e.target.value })}
          placeholder="Enter instructions for ranking"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Options</label>
        <div className="space-y-2 mt-2">
          {data.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
    </div>
  );
}
