import { MatchingNodeData } from "@/types/module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface MatchingNodeDetailsProps {
  data: MatchingNodeData;
  onUpdate: (updates: Partial<MatchingNodeData>) => void;
}

export function MatchingNodeDetails({ data, onUpdate }: MatchingNodeDetailsProps) {
  const addPair = () => {
    const newPairs = [...(data.pairs || []), { left: "Left", right: "Right" }];
    onUpdate({ pairs: newPairs });
  };

  const removePair = (index: number) => {
    const newPairs = data.pairs?.filter((_, i) => i !== index) || [];
    onUpdate({ pairs: newPairs });
  };

  const updatePair = (index: number, side: "left" | "right", value: string) => {
    const newPairs = [...(data.pairs || [])];
    newPairs[index] = { ...newPairs[index], [side]: value };
    onUpdate({ pairs: newPairs });
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
        <label className="text-sm font-medium">Matching Pairs</label>
        <div className="space-y-2 mt-2">
          {data.pairs?.map((pair, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={pair.left}
                onChange={(e) => updatePair(index, "left", e.target.value)}
                placeholder="Left item"
              />
              <Input
                value={pair.right}
                onChange={(e) => updatePair(index, "right", e.target.value)}
                placeholder="Right item"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePair(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addPair}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pair
        </Button>
      </div>
    </div>
  );
}