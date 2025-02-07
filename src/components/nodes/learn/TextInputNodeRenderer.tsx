
import { TextInputNodeData } from "@/types/module";

interface TextInputNodeRendererProps {
  data: TextInputNodeData;
}

export function TextInputNodeRenderer({ data }: TextInputNodeRendererProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{data.question}</h2>
      <textarea
        className="w-full h-32 p-4 border rounded-lg"
        placeholder="Type your answer here..."
      />
    </div>
  );
}
