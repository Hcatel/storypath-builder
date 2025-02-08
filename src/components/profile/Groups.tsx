
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function Groups() {
  const { user } = useAuth();

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

  return (
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
  );
}
