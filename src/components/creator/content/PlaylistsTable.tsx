
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistTableRow } from "./PlaylistTableRow";
import { useAuth } from "@/contexts/AuthContext";

export function PlaylistsTable() {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["creator-playlists", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select(`
          id,
          name,
          description,
          view_count,
          completion_rate,
          updated_at
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user, // Only run query if we have a user
  });

  const handleCreateClick = () => {
    console.log("Create Playlist button clicked - navigating to create playlist page");
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link to="/playlists/create" onClick={handleCreateClick}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </Link>
      </div>
      {playlistsLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Playlist Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Completion Rate</TableHead>
              <TableHead className="text-right">Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlists?.map((playlist) => (
              <PlaylistTableRow key={playlist.id} playlist={playlist} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
