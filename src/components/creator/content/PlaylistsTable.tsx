
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function PlaylistsTable() {
  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["creator-playlists"],
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
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link to="/playlists/create">
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
              <TableRow key={playlist.id}>
                <TableCell className="font-medium">
                  <Link 
                    to={`/playlists/${playlist.id}`}
                    className="text-primary hover:underline"
                  >
                    {playlist.name}
                  </Link>
                </TableCell>
                <TableCell>{playlist.description || '-'}</TableCell>
                <TableCell className="text-right">
                  {playlist.view_count || 0}
                </TableCell>
                <TableCell className="text-right">
                  {playlist.completion_rate 
                    ? `${Math.round(playlist.completion_rate)}%` 
                    : '0%'}
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(playlist.updated_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
