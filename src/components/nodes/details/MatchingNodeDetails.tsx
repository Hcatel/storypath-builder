
import { MatchingNodeData } from "@/types/module";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface MatchingNodeDetailsProps {
  data: MatchingNodeData;
  onUpdate: (updates: Partial<MatchingNodeData>) => void;
}

export function MatchingNodeDetails({ data, onUpdate }: MatchingNodeDetailsProps) {
  const addPair = () => {
    const newPairs = [...(data.pairs || []), { left: "", right: "" }];
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

  const handleTitleChange = (title: string) => {
    onUpdate({ title });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={data.title || ""}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter matching exercise title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Matching Pairs</label>
        <div className="space-y-2">
          {data.pairs?.map((pair, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Input
                value={pair.left}
                onChange={(e) => updatePair(index, "left", e.target.value)}
                placeholder="Left item"
                className="flex-1"
              />
              <Input
                value={pair.right}
                onChange={(e) => updatePair(index, "right", e.target.value)}
                placeholder="Right item"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePair(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addPair}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Matching Pair
        </Button>
      </div>
    </div>
  );
}
