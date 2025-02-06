
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ModuleTableRowProps {
  module: {
    id: string;
    title: string;
    access_type: string;
    published: boolean;
    estimated_duration_minutes: number | null;
    updated_at: string;
    module_completions: { count: number }[];
  };
}

export function ModuleTableRow({ module }: ModuleTableRowProps) {
  const getAccessBadgeVariant = (accessType: string, published: boolean) => {
    if (!published) return "secondary";
    switch (accessType) {
      case "public":
        return "default";
      case "private":
        return "secondary";
      case "restricted":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getAccessLabel = (accessType: string, published: boolean) => {
    if (!published) return "Draft";
    return accessType.charAt(0).toUpperCase() + accessType.slice(1);
  };

  return (
    <TableRow key={module.id}>
      <TableCell className="font-medium">
        <Link 
          to={`/modules/${module.id}/summary`}
          className="text-primary hover:underline"
        >
          {module.title}
        </Link>
      </TableCell>
      <TableCell>
        <Badge 
          variant={getAccessBadgeVariant(module.access_type, module.published)}
        >
          {getAccessLabel(module.access_type, module.published)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">-</TableCell>
      <TableCell className="text-right">
        {module.module_completions?.[0]?.count || 0} completions
      </TableCell>
      <TableCell className="text-right">
        {module.estimated_duration_minutes 
          ? `${module.estimated_duration_minutes} mins` 
          : '-'}
      </TableCell>
      <TableCell className="text-right">
        {format(new Date(module.updated_at), 'MMM d, yyyy')}
      </TableCell>
    </TableRow>
  );
}
