
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { PlaylistSidebar } from "@/components/playlist/PlaylistSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PlaylistBreadcrumb } from "@/components/playlist/PlaylistBreadcrumb";
import { EditPlaylistForm } from "@/components/playlist/EditPlaylistForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function PlaylistDetail() {
  const { id } = useParams();

  const { data: playlist, isLoading } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex w-full">
          <PlaylistSidebar playlistId={id} />
          <main className="flex-1 p-6">
            <PlaylistBreadcrumb currentPage={playlist?.name || "Loading..."} />
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="max-w-2xl">
                <EditPlaylistForm playlist={playlist} />
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
