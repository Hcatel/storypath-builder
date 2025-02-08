
import { MessageNodeData } from "@/types/module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MessageNodeRendererProps {
  data: MessageNodeData;
  onComplete?: () => void;
}

export function MessageNodeRenderer({ data, onComplete }: MessageNodeRendererProps) {
  if (!data.title || !data.content) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid message node data: Missing title or content
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm">
          {data.content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-700 mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
