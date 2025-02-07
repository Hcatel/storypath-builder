
import { LikertScaleNodeData, LikertDisplayType } from "@/types/module";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LikertScaleNodeDetailsProps {
  data: LikertScaleNodeData;
  onUpdate: (updates: Partial<LikertScaleNodeData>) => void;
}

export function LikertScaleNodeDetails({ data, onUpdate }: LikertScaleNodeDetailsProps) {
  const updateLabel = (scale: number, label: string) => {
    const newLabels = { ...data.labels, [scale]: label };
    onUpdate({ labels: newLabels });
  };

  const displayOptions: { value: LikertDisplayType; label: string }[] = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'slider', label: 'Slider' },
    { value: 'stars', label: 'Stars' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={data.question || ""}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter question"
        />
      </div>

      <div>
        <Label>Display Type</Label>
        <Select
          value={data.displayType}
          onValueChange={(value: LikertDisplayType) => onUpdate({ displayType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select display type" />
          </SelectTrigger>
          <SelectContent>
            {displayOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Scale Start</Label>
          <Input
            type="number"
            value={data.scaleStart}
            onChange={(e) => onUpdate({ scaleStart: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Scale End</Label>
          <Input
            type="number"
            value={data.scaleEnd}
            onChange={(e) => onUpdate({ scaleEnd: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Start Text</Label>
          <Input
            value={data.startText || ""}
            onChange={(e) => onUpdate({ startText: e.target.value })}
            placeholder="e.g., Strongly Disagree"
          />
        </div>
        <div>
          <Label>Middle Text</Label>
          <Input
            value={data.middleText || ""}
            onChange={(e) => onUpdate({ middleText: e.target.value })}
            placeholder="e.g., Neutral"
          />
        </div>
        <div>
          <Label>End Text</Label>
          <Input
            value={data.endText || ""}
            onChange={(e) => onUpdate({ endText: e.target.value })}
            placeholder="e.g., Strongly Agree"
          />
        </div>
      </div>

      <div>
        <Label>Scale Labels</Label>
        <div className="space-y-2 mt-2">
          {Array.from(
            { length: (data.scaleEnd || 5) - (data.scaleStart || 1) + 1 },
            (_, i) => (data.scaleStart || 1) + i
          ).map((scale) => (
            <div key={scale} className="flex gap-2 items-center">
              <span className="text-sm font-medium w-8">{scale}</span>
              <Input
                value={data.labels?.[scale] || ""}
                onChange={(e) => updateLabel(scale, e.target.value)}
                placeholder={`Label for ${scale}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
