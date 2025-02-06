
import { TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface PlaylistTableRowProps {
  playlist: {
    id: string;
    name: string;
    description: string | null;
    view_count: number | null;
    completion_rate: number | null;
    updated_at: string;
  };
}

export function PlaylistTableRow({ playlist }: PlaylistTableRowProps) {
  return (
    <TableRow key={playlist.id}>
      <TableCell className="font-medium">
        <Link 
          to={`/playlists/${playlist.id}`}
          className="text-primary hover:underline"
        >
          {playlist.name}
        </Link>
      </TableCell>
      <TableCell>{playlist.description || '-'}</TableCell>
      <TableCell className="text-right">
        {playlist.view_count || 0}
      </TableCell>
      <TableCell className="text-right">
        {playlist.completion_rate 
          ? `${Math.round(playlist.completion_rate)}%` 
          : '0%'}
      </TableCell>
      <TableCell className="text-right">
        {format(new Date(playlist.updated_at), 'MMM d, yyyy')}
      </TableCell>
    </TableRow>
  );
}
