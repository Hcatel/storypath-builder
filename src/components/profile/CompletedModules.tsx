
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Timer, CalendarClock } from "lucide-react";

interface CompletedModulesProps {
  onSelectCompletion: (completion: any) => void;
}

export function CompletedModules({ onSelectCompletion }: CompletedModulesProps) {
  const { user } = useAuth();

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ['module_completions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_completions')
        .select(`
          *,
          module:modules(*)
        `)
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching completions:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Modules</CardTitle>
        <CardDescription>Your completed learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        {completionsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : completions?.length ? (
          <div className="space-y-4">
            {completions.map((completion: any) => (
              <Card key={completion.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{completion.module?.title || 'Untitled Module'}</h3>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          Started on {format(new Date(completion.started_at), 'PPp')}
                        </div>
                        {completion.time_spent_seconds && (
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            {Math.round(completion.time_spent_seconds / 60)} minutes
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectCompletion(completion)}
                    >
                      View Summary
                    </Button>
                  </div>
                  {completion.score !== null && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span>{completion.score}%</span>
                      </div>
                      <Progress value={completion.score} />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't completed any modules yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
