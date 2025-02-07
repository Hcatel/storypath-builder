
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { PlaylistModule } from "./types";
import { PlaylistModuleRow } from "./PlaylistModuleRow";
import { usePlaylistModules } from "./usePlaylistModules";

interface PlaylistModulesTableProps {
  modules: PlaylistModule[];
  isLoading: boolean;
  playlistId: string;
}

export function PlaylistModulesTable({ modules, isLoading, playlistId }: PlaylistModulesTableProps) {
  const { handleDragEnd, handleDelete } = usePlaylistModules(playlistId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No modules added to this playlist yet.
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={(result) => handleDragEnd(result, modules)}>
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
              {modules.map((item, index) => {
                if (!item?.id) return null;
                
                return (
                  <Draggable 
                    key={item.id} 
                    draggableId={item.id} 
                    index={index}
                  >
                    {(provided) => (
                      <PlaylistModuleRow 
                        item={item}
                        provided={provided}
                        onDelete={handleDelete}
                      />
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
}

