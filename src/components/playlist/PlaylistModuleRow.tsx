
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaylistModule } from "./types";
import { DraggableProvided } from "@hello-pangea/dnd";

interface PlaylistModuleRowProps {
  item: PlaylistModule;
  provided: DraggableProvided;
  onDelete: (moduleId: string) => void;
}

export function PlaylistModuleRow({ item, provided, onDelete }: PlaylistModuleRowProps) {
  return (
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
          onClick={() => onDelete(item.id)}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

