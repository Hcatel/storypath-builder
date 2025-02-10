
import { Header } from "@/components/Header";
import { useParams, useLocation } from "react-router-dom";
import { PlaylistSidebar } from "@/components/playlist/PlaylistSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EditPlaylistForm } from "@/components/playlist/EditPlaylistForm";
import { PlaylistContent } from "@/components/playlist/PlaylistContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function PlaylistDetail() {
  const { id } = useParams();
  const location = useLocation();
  const isCreateMode = id === "create";
  const showContent = location.pathname.includes("/content");

  useEffect(() => {
    console.log(`Playlist details page loaded - ID: ${id}, Create mode: ${isCreateMode}`);
  }, [id, isCreateMode]);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !isCreateMode,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex w-full">
          <PlaylistSidebar playlistId={id} />
          <main className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-6">
              {showContent ? "Playlist Content" : "Playlist Details"}
            </h1>
            {!isCreateMode && isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-6">
                {showContent ? (
                  !isCreateMode && <PlaylistContent playlistId={id} />
                ) : (
                  <div className="max-w-2xl">
                    <EditPlaylistForm 
                      playlist={playlist} 
                      isCreateMode={isCreateMode} 
                    />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
