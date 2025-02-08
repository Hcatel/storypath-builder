
import { useState } from "react";
import { TextInputNodeData } from "@/types/module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextInputNodeRendererProps {
  data: TextInputNodeData;
  onSubmit?: () => void;
}

export function TextInputNodeRenderer({ data, onSubmit }: TextInputNodeRendererProps) {
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  if (!data.question) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid text input node data: Missing question
        </AlertDescription>
      </Alert>
    );
  }

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an answer before submitting",
      });
      return;
    }

    toast({
      title: "Answer submitted",
      description: "Your response has been recorded",
    });
    
    onSubmit?.();
    setAnswer("");
  };

  return (
    <Card className="max-w-2xl w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{data.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="min-h-[120px]"
        />
        <Button 
          onClick={handleSubmit}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );
}
