
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Timer, CalendarClock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CompletedModulesProps {
  onSelectCompletion: (completion: any) => void;
}

interface ModuleCompletions {
  [key: string]: {
    moduleTitle: string;
    completions: any[];
  };
}

export function CompletedModules({ onSelectCompletion }: CompletedModulesProps) {
  const { user } = useAuth();
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});

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

      // Group completions by module
      const grouped = data.reduce((acc: ModuleCompletions, completion) => {
        const moduleId = completion.module_id;
        if (!acc[moduleId]) {
          acc[moduleId] = {
            moduleTitle: completion.module?.title || 'Untitled Module',
            completions: []
          };
        }
        acc[moduleId].completions.push(completion);
        return acc;
      }, {});

      return grouped;
    },
    enabled: !!user,
  });

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

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

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
        ) : completions && Object.keys(completions).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(completions).map(([moduleId, moduleData]) => (
              <Card key={moduleId} className="p-4">
                <Collapsible>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{moduleData.moduleTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {moduleData.completions.length} session{moduleData.completions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleModule(moduleId)}
                      >
                        {expandedModules[moduleId] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-4 mt-4">
                    {moduleData.completions.map((completion: any) => (
                      <Card key={completion.id} className="p-4 bg-muted/50">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4" />
                                Completed on {formatDate(completion.completed_at)}
                              </div>
                              {completion.time_spent_seconds && (
                                <div className="flex items-center gap-2">
                                  <Timer className="h-4 w-4" />
                                  {Math.round(completion.time_spent_seconds / 60)} minutes
                                </div>
                              )}
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
                  </CollapsibleContent>
                </Collapsible>
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
