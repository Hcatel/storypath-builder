
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Navigate, Link } from "react-router-dom";

type ProfileView = "learner" | "creator";

const Profile = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ProfileView>("learner");

  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ['module_completions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_completions')
        .select(`
          *,
          module:modules(*)
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['creator_subscriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_subscriptions')
        .select(`
          *,
          creator:creator_id(
            id,
            profiles:profiles(*)
          )
        `)
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
          <Button
            onClick={() => setView(view === "learner" ? "creator" : "learner")}
            variant="outline"
          >
            Switch to {view === "learner" ? "Creator" : "Learner"} View
          </Button>
        </div>

        {view === "learner" ? (
          <div className="grid gap-6">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>Track your module completion and progress</CardDescription>
              </CardHeader>
              <CardContent>
                {completionsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : completions?.length ? (
                  <div className="space-y-6">
                    {completions.map((completion: any) => (
                      <div key={completion.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{completion.module.title}</h3>
                          <Link to={`/modules/${completion.module.id}`}>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </Link>
                        </div>
                        <Progress value={100} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No completed modules yet. Start learning!</p>
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
                                {subscription.creator.profiles?.username || 'Anonymous'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Subscribed since {new Date(subscription.subscribed_at).toLocaleDateString()}
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
        ) : (
          <div className="grid gap-6">
            {/* Creator Stats - To be implemented */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Dashboard</CardTitle>
                <CardDescription>Track your module performance and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Creator view features coming soon!</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
