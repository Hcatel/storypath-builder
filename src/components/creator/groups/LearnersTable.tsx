
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LearnersTable() {
  const { data: learners, isLoading } = useQuery({
    queryKey: ["learners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          id,
          joined_at,
          user_id,
          group:group_id (
            id,
            name
          ),
          profile:user_id (
            id,
            username
          )
        `);
      
      if (error) throw error;
      return data;
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
            <TableCell className="font-medium">{learner.profile?.username || 'Unknown user'}</TableCell>
            <TableCell>{learner.group?.name}</TableCell>
            <TableCell className="text-right">{format(new Date(learner.joined_at), 'MMM d, yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
