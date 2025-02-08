
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { format } from "date-fns";
import { CardContent, Card } from "@/components/ui/card";
import { Timer, Calendar } from "lucide-react";

interface ModuleSummaryDrawerProps {
  completion: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModuleSummaryDrawer({ completion, open, onOpenChange }: ModuleSummaryDrawerProps) {
  if (!completion) return null;

  console.log('Completion data:', completion);
  console.log('Choices:', completion.choices);

  const durationInMinutes = completion.time_spent_seconds 
    ? Math.round(completion.time_spent_seconds / 60) 
    : null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Invalid date';
      }
      return format(date, 'PPp');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get all module completions for this module to determine session number
  const moduleCompletions = completion.module?.module_completions || [];
  const sessionNumber = moduleCompletions
    .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .findIndex((c: any) => c.id === completion.id) + 1;

  // Ensure choices is an array and handle older completions that might not have choices
  const choices = Array.isArray(completion.choices) ? completion.choices : [];
  console.log('Processed choices:', choices);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>{completion.module?.title || 'Module'} Summary</SheetTitle>
          <SheetDescription>Session {sessionNumber}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Started</span>
                </div>
                <p className="mt-1 font-medium">
                  {formatDate(completion.started_at)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Completed</span>
                </div>
                <p className="mt-1 font-medium">
                  {formatDate(completion.completed_at)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Duration */}
          {durationInMinutes && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="mt-1 font-medium">
                  {durationInMinutes} minutes
                </p>
              </CardContent>
            </Card>
          )}

          {/* Text Input Responses */}
          {choices.length > 0 && choices.some((choice: any) => choice.type === 'text_input') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Text Responses</h3>
              {choices
                .filter((choice: any) => choice.type === 'text_input')
                .map((choice: any, index: number) => (
                  <Card key={`text-${index}`}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{choice.question}</p>
                      <p className="mt-2 font-medium">{choice.answer}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* Router Choices */}
          {choices.length > 0 && choices.some((choice: any) => choice.type === 'router') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Decisions Made</h3>
              {choices
                .filter((choice: any) => choice.type === 'router')
                .map((choice: any, index: number) => (
                  <Card key={`router-${index}`}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{choice.question}</p>
                      <p className="mt-2 font-medium">{choice.answer}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* Rankings */}
          {choices.length > 0 && choices.some((choice: any) => choice.type === 'ranking') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rankings</h3>
              {choices
                .filter((choice: any) => choice.type === 'ranking')
                .map((choice: any, index: number) => (
                  <Card key={`ranking-${index}`}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{choice.title}</p>
                      <div className="mt-2 space-y-2">
                        {choice.ranking.map((item: string, rankIndex: number) => (
                          <div key={rankIndex} className="flex items-center gap-2">
                            <span className="font-medium">{rankIndex + 1}.</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          {/* Multiple Choice Answers */}
          {choices.length > 0 && choices.some((choice: any) => choice.type === 'multiple_choice') && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Multiple Choice Answers</h3>
              {choices
                .filter((choice: any) => choice.type === 'multiple_choice')
                .map((choice: any, index: number) => (
                  <Card key={`mc-${index}`}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">{choice.question}</p>
                      <div className="mt-2">
                        {Array.isArray(choice.answer) ? (
                          choice.answer.map((ans: string, ansIndex: number) => (
                            <p key={ansIndex} className="font-medium">{ans}</p>
                          ))
                        ) : (
                          <p className="font-medium">{choice.answer}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
