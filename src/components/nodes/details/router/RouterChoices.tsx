
import { useEffect, useState } from "react";
import { RouterChoice } from "./RouterChoice";
import { AddChoiceButton } from "./AddChoiceButton";
import { RouterChoicesProps } from "./types";

export function RouterChoices({
  data,
  availableNodes,
  onUpdate,
  onConfigureConditions,
}: RouterChoicesProps) {
  // Local state to track choices
  const [choices, setChoices] = useState(data.choices);

  // Update local state when data prop changes
  useEffect(() => {
    setChoices(data.choices);
  }, [data.choices]);

  const handleChoiceUpdate = (index: number, updates: { text?: string; nextNodeId?: string }) => {
    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], ...updates };
    setChoices(newChoices);
    onUpdate({ ...data, choices: newChoices });
  };

  const handleDeleteChoice = (index: number) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setChoices(newChoices);
    onUpdate({ ...data, choices: newChoices });
  };

  const handleAddChoice = () => {
    const newChoices = [...choices, { text: '', nextNodeId: '' }];
    setChoices(newChoices);
    onUpdate({ ...data, choices: newChoices });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choices</label>
      {choices.map((choice, index) => (
        <RouterChoice
          key={`choice-${index}-${choice.nextNodeId}`}
          choice={choice}
          index={index}
          availableNodes={availableNodes}
          onUpdate={handleChoiceUpdate}
          onDelete={handleDeleteChoice}
          onConfigureConditions={onConfigureConditions}
        />
      ))}
      <AddChoiceButton onClick={handleAddChoice} />
    </div>
  );
}
