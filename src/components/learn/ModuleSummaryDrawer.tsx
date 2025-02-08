
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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

  const durationInMinutes = completion.time_spent_seconds 
    ? Math.round(completion.time_spent_seconds / 60) 
    : null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Check if the date is valid
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{completion.module?.title || 'Module Summary'}</SheetTitle>
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

          {/* Choices Made */}
          {completion.choices && completion.choices.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Choices</h3>
              {completion.choices.map((choice: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">{choice.question}</p>
                    <p className="mt-2 font-medium">{choice.answer}</p>
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
