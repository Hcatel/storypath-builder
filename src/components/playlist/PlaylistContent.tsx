
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistModulesTable } from "./PlaylistModulesTable";
import { AddContentDialog } from "./AddContentDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

interface PlaylistContentProps {
  playlistId: string;
}

export function PlaylistContent({ playlistId }: PlaylistContentProps) {
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);

  const { data: modules, isLoading, error } = useQuery({
    queryKey: ["playlist-modules", playlistId],
    queryFn: async () => {
      console.log("Fetching modules for playlist:", playlistId);
      
      const { data, error } = await supabase
        .from("playlist_modules")
        .select(`
          id,
          position,
          module:modules (
            id,
            title,
            thumbnail_url,
            estimated_duration_minutes,
            updated_at,
            module_completions (count)
          )
        `)
        .eq("playlist_id", playlistId)
        .order("position");

      if (error) {
        console.error("Error fetching playlist modules:", error);
        throw error;
      }

      console.log("Fetched playlist modules:", data);
      return data;
    },
  });

  // If there's an error, we should display it
  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading playlist content: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Content</h2>
        <Button onClick={() => setIsAddContentOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      <PlaylistModulesTable 
        modules={modules || []} 
        isLoading={isLoading}
        playlistId={playlistId}
      />

      <AddContentDialog
        open={isAddContentOpen}
        onOpenChange={setIsAddContentOpen}
        playlistId={playlistId}
      />
    </div>
  );
}
