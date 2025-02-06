
import { Handle, Position } from "@xyflow/react";
import { MultipleChoiceNodeData } from "@/types/module";

export function MultipleChoiceNode({ data }: { data: MultipleChoiceNodeData }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-background w-[200px]">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-muted-foreground">Multiple Choice</div>
        </div>
        <div className="text-sm font-bold mt-2">{data.question || "Enter question"}</div>
        {data.options && data.options.length > 0 ? (
          <div className="mt-2 space-y-1">
            {data.options.map((option, index) => (
              <div key={index} className="text-xs p-1 bg-muted rounded">
                {option}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground mt-2">No options added</div>
        )}
      </div>
      <Handle type="target" position={Position.Top} className="w-16 !bg-muted" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-muted" />
    </div>
  );
}
