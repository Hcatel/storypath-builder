
import { Header } from "@/components/Header";
import { useParams } from "react-router-dom";
import { PlaylistSidebar } from "@/components/playlist/PlaylistSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EditPlaylistForm } from "@/components/playlist/EditPlaylistForm";
import { PlaylistContent } from "@/components/playlist/PlaylistContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlaylistDetail() {
  const { id } = useParams();
  const isCreateMode = id === "create";

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
            <h1 className="text-2xl font-bold mb-6">Playlist Details</h1>
            {!isCreateMode && isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-6">
                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="content" disabled={isCreateMode}>
                      Content
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <div className="max-w-2xl pt-4">
                      <EditPlaylistForm 
                        playlist={playlist} 
                        isCreateMode={isCreateMode} 
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="content">
                    {!isCreateMode && <PlaylistContent playlistId={id} />}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
