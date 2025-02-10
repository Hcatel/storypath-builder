
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GroupWithCounts {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  group_members: { count: number }[];
  playlist_group_access: { count: number }[];
}

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
      return data as GroupWithCounts[];
    },
  });

  const handleRowClick = (groupId: string) => {
    console.log(`Navigating to group details for group: ${groupId}`);
    navigate(`/creator/groups/${groupId}`);
  };

  const handleCreateClick = () => {
    console.log("Create Group button clicked - navigating to create group page");
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
    <>
      <div className="flex justify-end mb-4">
        <Link to="/creator/groups/create" onClick={handleCreateClick}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>
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
    </>
  );
}
