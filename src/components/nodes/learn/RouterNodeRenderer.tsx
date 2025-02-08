
import { RouterNodeData } from "@/types/module";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RouterNodeRendererProps {
  data: RouterNodeData;
  onChoiceSelect?: (choiceIndex: number) => void;
  className?: string;
}

export function RouterNodeRenderer({ data, onChoiceSelect, className = "" }: RouterNodeRendererProps) {
  if (!data.choices || !Array.isArray(data.choices)) {
    console.error("RouterNodeRenderer: No valid choices provided", data);
    return null;
  }

  return (
    <div className={`max-w-4xl w-full mx-auto ${className} ${data.isOverlay ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : ''}`}>
      <Card className={`p-6 ${data.isOverlay ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}`}>
        <h2 className="text-2xl font-semibold mb-8 text-center">{data.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {data.choices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-6 h-auto text-lg font-medium"
              onClick={() => {
                console.log("Choice clicked:", choice);
                onChoiceSelect?.(index);
              }}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
