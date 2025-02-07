
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { DropResult } from "@hello-pangea/dnd";
import { PlaylistModule } from "./types";

export function usePlaylistModules(playlistId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: DropResult, modules: PlaylistModule[]) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions in the database
    const updates = items.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    try {
      const { error } = await supabase
        .from("playlist_modules")
        .upsert(updates);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["playlist-modules", playlistId] });

      toast({
        title: "Success",
        description: "Module order updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update module order: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (!moduleId) {
      toast({
        title: "Error",
        description: "Invalid module ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("playlist_modules")
        .delete()
        .eq("id", moduleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["playlist-modules", playlistId] });

      toast({
        title: "Success",
        description: "Module removed from playlist",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to remove module: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return {
    handleDragEnd,
    handleDelete,
  };
}

