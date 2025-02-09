
import { RouterChoice } from "./RouterChoice";
import { AddChoiceButton } from "./AddChoiceButton";
import { RouterChoicesProps } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ban } from "lucide-react";

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
    // Prevent deletion if we're at minimum choices
    if (data.choices.length <= 2) {
      return;
    }
    
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

  // Validation checks
  const hasMinimumChoices = data.choices.length >= 2;
  const allChoicesHaveNextNodes = data.choices.every(choice => choice.nextNodeId);
  const validationErrors = [];

  if (!hasMinimumChoices) {
    validationErrors.push("At least two choices are required");
  }

  if (!allChoicesHaveNextNodes) {
    validationErrors.push("All choices must connect to a next node");
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Choices</label>
      
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <Ban className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        {data.choices.map((choice, index) => (
          <RouterChoice
            key={`choice-${index}-${choice.text}`}
            choice={choice}
            index={index}
            availableNodes={availableNodes}
            onUpdate={handleChoiceUpdate}
            onDelete={handleDeleteChoice}
            onConfigureConditions={onConfigureConditions}
            showDeleteButton={data.choices.length > 2}
          />
        ))}
      </div>
      
      <AddChoiceButton onClick={handleAddChoice} />
    </div>
  );
}
