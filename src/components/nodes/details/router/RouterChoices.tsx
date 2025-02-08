
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RouterChoice } from "./RouterChoice";
import { RouterNodeData, NodeData } from "@/types/module";
import { Node } from "@xyflow/react";

interface RouterChoicesProps {
  data: RouterNodeData;
  availableNodes: Node<NodeData>[];
  onUpdate: (updates: Partial<RouterNodeData>) => void;
  onConfigureConditions: (index: number) => void;
}

export function RouterChoices({
  data,
  availableNodes,
  onUpdate,
  onConfigureConditions,
}: RouterChoicesProps) {
  const handleChoiceUpdate = (index: number, updates: { text?: string; nextNodeId?: string }) => {
    const newChoices = [...data.choices];
    newChoices[index] = { ...newChoices[index], ...updates };
    onUpdate({ ...data, choices: newChoices });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choices</label>
      {data.choices.map((choice, index) => (
        <RouterChoice
          key={`${choice.nextNodeId}-${index}-${availableNodes.length}`}
          choice={choice}
          index={index}
          availableNodes={availableNodes}
          onUpdate={handleChoiceUpdate}
          onDelete={() => {
            const newChoices = data.choices.filter((_, i) => i !== index);
            onUpdate({ ...data, choices: newChoices });
          }}
          onConfigureConditions={onConfigureConditions}
        />
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const newChoices = [...data.choices, { text: '', nextNodeId: '' }];
          onUpdate({ ...data, choices: newChoices });
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Choice
      </Button>
    </div>
  );
}
