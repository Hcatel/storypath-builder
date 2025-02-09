
import { RouterChoice } from "./RouterChoice";
import { AddChoiceButton } from "./AddChoiceButton";
import { RouterChoicesProps } from "./types";

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

  const handleDeleteChoice = (index: number) => {
    const newChoices = data.choices.filter((_, i) => i !== index);
    onUpdate({ ...data, choices: newChoices });
  };

  const handleAddChoice = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const newChoice = {
      text: `Choice ${data.choices.length + 1}`,
      nextNodeId: ''
    };
    
    onUpdate({
      ...data,
      choices: [...data.choices, newChoice],
    });
  };

  if (!data.choices) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choices</label>
      {data.choices.map((choice, index) => (
        <RouterChoice
          key={`choice-${index}-${choice.text}`}
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
