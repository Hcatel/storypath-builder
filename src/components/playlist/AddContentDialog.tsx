
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: string;
}

export function AddContentDialog({ open, onOpenChange, playlistId }: AddContentDialogProps) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["creator-modules", search],
    queryFn: async () => {
      const query = supabase
        .from("modules")
        .select(`
          id,
          title,
          thumbnail_url,
          estimated_duration_minutes,
          updated_at,
          module_completions (count)
        `)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .order("updated_at", { ascending: false });

      if (search) {
        query.ilike("title", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: existingModules } = useQuery({
    queryKey: ["playlist-modules", playlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlist_modules")
        .select("module_id")
        .eq("playlist_id", playlistId);

      if (error) throw error;
      return data.map(m => m.module_id);
    },
  });

  const handleAddModule = async (moduleId: string) => {
    try {
      // Get the current highest position
      const { data: currentModules, error: fetchError } = await supabase
        .from("playlist_modules")
        .select("position")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const newPosition = currentModules?.[0]?.position !== undefined 
        ? currentModules[0].position + 1 
        : 0;

      const { error } = await supabase
        .from("playlist_modules")
        .insert({
          playlist_id: playlistId,
          module_id: moduleId,
          position: newPosition,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["playlist-modules", playlistId] });

      toast({
        title: "Success",
        description: "Module added to playlist successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to add module: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Content to Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Tabs defaultValue="modules">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="playlists" disabled>Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-4">
              {modulesLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {modules?.map((module) => {
                    const isAdded = existingModules?.includes(module.id);
                    
                    return (
                      <div 
                        key={module.id}
                        className="flex items-start gap-3 p-3 border rounded-lg"
                      >
                        {module.thumbnail_url && (
                          <img 
                            src={module.thumbnail_url}
                            alt={module.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.estimated_duration_minutes 
                              ? `${module.estimated_duration_minutes} mins`
                              : 'Duration not set'
                            }
                          </p>
                          <Button
                            variant={isAdded ? "outline" : "default"}
                            size="sm"
                            className="mt-2"
                            onClick={() => handleAddModule(module.id)}
                            disabled={isAdded}
                          >
                            {isAdded ? "Added" : "Add to Playlist"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
