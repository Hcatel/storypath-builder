
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface PlaylistModule {
  id: string;
  position: number;
  module: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    estimated_duration_minutes: number | null;
    updated_at: string;
    module_completions: { count: number }[];
  };
}

interface PlaylistModulesTableProps {
  modules: PlaylistModule[];
  isLoading: boolean;
  playlistId: string;
}

export function PlaylistModulesTable({ modules, isLoading, playlistId }: PlaylistModulesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: any) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 50 }}></TableHead>
            <TableHead>Module</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Completion Rate</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-right">Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <Droppable droppableId="modules">
          {(provided) => (
            <TableBody {...provided.droppableProps} ref={provided.innerRef}>
              {modules.map((item, index) => (
                <Draggable 
                  key={item.id} 
                  draggableId={item.id} 
                  index={index}
                >
                  {(provided) => (
                    <TableRow 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <TableCell>
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-3">
                        {item.module?.thumbnail_url && (
                          <img 
                            src={item.module.thumbnail_url} 
                            alt={item.module?.title || 'Module thumbnail'}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        <span>{item.module?.title || 'Untitled Module'}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.module?.module_completions?.[0]?.count || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        -
                      </TableCell>
                      <TableCell className="text-right">
                        {item.module?.estimated_duration_minutes 
                          ? `${item.module.estimated_duration_minutes} mins`
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        {item.module?.updated_at 
                          ? format(new Date(item.module.updated_at), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}
