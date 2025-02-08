
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Navigate } from "react-router-dom";
import { ViewToggle } from "@/components/ViewToggle";
import { format } from "date-fns";
import { useState } from "react";
import { ModuleSummaryDrawer } from "@/components/learn/ModuleSummaryDrawer";
import { Timer, CalendarClock } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [selectedCompletion, setSelectedCompletion] = useState<any>(null);

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

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['creator_subscriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_subscriptions')
        .select('*, creator:creator_subscriptions_creator_id_fkey(id, username, avatar_url)')
        .eq('subscriber_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['group_members', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          group:groups(*)
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <ViewToggle isCreatorView={false} />
        </div>

        <div className="grid gap-6">
          {/* Completed Modules */}
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
                            onClick={() => setSelectedCompletion(completion)}
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

          {/* Subscribed Creators */}
          <Card>
            <CardHeader>
              <CardTitle>Subscribed Creators</CardTitle>
              <CardDescription>Creators you follow</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : subscriptions?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map((subscription: any) => (
                    <Card key={subscription.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <p className="font-medium">
                              {subscription.creator?.username || 'Anonymous'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Subscribed since {format(new Date(subscription.subscribed_at), 'PPP')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't subscribed to any creators yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Your Groups</CardTitle>
              <CardDescription>Learning communities you're part of</CardDescription>
            </CardHeader>
            <CardContent>
              {groupsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : groups?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groups.map((membership: any) => (
                    <Card key={membership.id}>
                      <CardContent className="pt-6">
                        <h3 className="font-medium">{membership.group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {membership.group.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't joined any groups yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <ModuleSummaryDrawer
        completion={selectedCompletion}
        open={!!selectedCompletion}
        onOpenChange={(open) => !open && setSelectedCompletion(null)}
      />
    </div>
  );
};

export default Profile;
