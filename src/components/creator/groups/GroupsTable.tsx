
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function GroupsTable() {
  const navigate = useNavigate();

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members(count),
          playlist_group_access(count)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const handleRowClick = (groupId: string) => {
    console.log(`Navigating to group details for group: ${groupId}`);
    navigate(`/groups/${groupId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No groups created yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Learners</TableHead>
          <TableHead className="text-right">Playlists</TableHead>
          <TableHead className="text-right">Created</TableHead>
          <TableHead className="text-right">Last Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group) => (
          <TableRow 
            key={group.id}
            onClick={() => handleRowClick(group.id)}
            className="cursor-pointer hover:bg-muted"
          >
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell>{group.description}</TableCell>
            <TableCell className="text-right">{group.group_members[0]?.count || 0}</TableCell>
            <TableCell className="text-right">{group.playlist_group_access[0]?.count || 0}</TableCell>
            <TableCell className="text-right">{format(new Date(group.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell className="text-right">{format(new Date(group.updated_at), 'MMM d, yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

