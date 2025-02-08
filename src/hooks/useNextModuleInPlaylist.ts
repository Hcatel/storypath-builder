
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useNextModuleInPlaylist(playlistModuleId: string | null) {
  return useQuery({
    queryKey: ["next-module", playlistModuleId],
    queryFn: async () => {
      if (!playlistModuleId) return null;

      const { data: currentModule } = await supabase
        .from("playlist_modules")
        .select("position, playlist_id")
        .eq("id", playlistModuleId)
        .single();

      if (!currentModule) return null;

      const { data: nextModule } = await supabase
        .from("playlist_modules")
        .select("id, module:modules(id)")
        .eq("playlist_id", currentModule.playlist_id)
        .eq("position", currentModule.position + 1)
        .single();

      return nextModule;
    },
    enabled: !!playlistModuleId,
  });
}
