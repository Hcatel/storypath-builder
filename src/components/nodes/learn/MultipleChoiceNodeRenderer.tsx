
import { MultipleChoiceNodeData } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MultipleChoiceNodeRendererProps {
  data: MultipleChoiceNodeData;
  onOptionSelect?: (optionIndex: number) => void;
}

export function MultipleChoiceNodeRenderer({ data, onOptionSelect }: MultipleChoiceNodeRendererProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    setSelectedIndexes(prev => {
      // If the index is already selected, remove it (deselect)
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      
      // If multiple selection is not allowed, replace the selection
      if (!data.allowMultiple) {
        return [index];
      }
      
      // If multiple selection is allowed, add the new selection
      return [...prev, index];
    });

    onOptionSelect?.(index);
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-8 text-center">{data.question}</h2>
        <div className="flex flex-col space-y-4">
          {data.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedIndexes.includes(index) ? "default" : "outline"}
              className="p-6 h-auto text-lg font-medium text-left justify-start"
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
