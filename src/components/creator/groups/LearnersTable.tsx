
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LearnerData {
  id: string;
  joined_at: string;
  user_id: string;
  groups: {
    id: string;
    name: string;
  } | null;
  profiles: {
    id: string;
    username: string | null;
  } | null;
}

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
          groups (
            id,
            name
          ),
          profiles (
            id,
            username
          )
        `);
      
      if (error) throw error;
      return data as LearnerData[];
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
            <TableCell>{learner.groups?.name}</TableCell>
            <TableCell className="text-right">{format(new Date(learner.joined_at), 'MMM d, yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
