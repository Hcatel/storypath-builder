
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LearnerData {
  id: string;
  joined_at: string;
  user_id: string;
  group_id: string;
  group_name: string;
  profiles: {
    username: string | null;
  } | null;
}

export function LearnersTable() {
  const { data: learners, isLoading } = useQuery({
    queryKey: ["learners"],
    queryFn: async () => {
      // First get the groups the user has access to
      const { data: groups, error: groupsError } = await supabase
        .from("groups")
        .select("id, name");
      
      if (groupsError) throw groupsError;

      // Then get the members for those groups with profiles
      const { data: members, error: membersError } = await supabase
        .from("group_members")
        .select(`
          id,
          joined_at,
          user_id,
          group_id,
          profiles!group_members_user_id_fkey (
            username
          )
        `);
      
      if (membersError) throw membersError;

      // Combine the data
      const processedData = members?.map(member => {
        const group = groups?.find(g => g.id === member.group_id);
        return {
          id: member.id,
          joined_at: member.joined_at,
          user_id: member.user_id,
          group_id: member.group_id,
          group_name: group?.name || 'Unknown group',
          profiles: member.profiles
        };
      }) || [];
      
      return processedData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!learners || learners.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No learners found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Group</TableHead>
          <TableHead className="text-right">Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {learners.map((learner) => (
          <TableRow key={learner.id}>
            <TableCell className="font-medium">{learner.profiles?.username || 'Unknown user'}</TableCell>
            <TableCell>{learner.group_name}</TableCell>
            <TableCell className="text-right">{format(new Date(learner.joined_at), 'MMM d, yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
