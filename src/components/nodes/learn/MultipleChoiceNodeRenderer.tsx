
import { MultipleChoiceNodeData } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MultipleChoiceNodeRendererProps {
  data: MultipleChoiceNodeData;
  onOptionSelect?: (optionIndex: number) => void;
}

export function MultipleChoiceNodeRenderer({ data, onOptionSelect }: MultipleChoiceNodeRendererProps) {
  return (
    <div className="max-w-2xl w-full mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-8 text-center">{data.question}</h2>
        <div className="flex flex-col space-y-4">
          {data.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-6 h-auto text-lg font-medium text-left justify-start"
              onClick={() => onOptionSelect?.(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
