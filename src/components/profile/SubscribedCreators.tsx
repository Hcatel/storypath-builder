
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export function SubscribedCreators() {
  const { user } = useAuth();

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

  return (
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
  );
}
