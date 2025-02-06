import { LikertScaleNodeData } from "@/types/module";
import { Input } from "@/components/ui/input";

interface LikertScaleNodeDetailsProps {
  data: LikertScaleNodeData;
  onUpdate: (updates: Partial<LikertScaleNodeData>) => void;
}

export function LikertScaleNodeDetails({ data, onUpdate }: LikertScaleNodeDetailsProps) {
  const updateLabel = (scale: number, label: string) => {
    const newLabels = { ...data.labels, [scale]: label };
    onUpdate({ labels: newLabels });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Question</label>
        <Input
          value={data.question || ""}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter question"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Scale Start</label>
          <Input
            type="number"
            value={data.scaleStart}
            onChange={(e) => onUpdate({ scaleStart: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Scale End</label>
          <Input
            type="number"
            value={data.scaleEnd}
            onChange={(e) => onUpdate({ scaleEnd: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Scale Labels</label>
        <div className="space-y-2 mt-2">
          {Array.from(
            { length: data.scaleEnd - data.scaleStart + 1 },
            (_, i) => data.scaleStart + i
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