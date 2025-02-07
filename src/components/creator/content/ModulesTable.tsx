
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModuleTableRow } from "./ModuleTableRow";
import { useAuth } from "@/contexts/AuthContext";

export function ModulesTable() {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ["creator-modules", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select(`
          id,
          title,
          access_type,
          published,
          estimated_duration_minutes,
          updated_at,
          module_completions (count)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user, // Only run query if we have a user
  });

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link to="/modules/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Module
          </Button>
        </Link>
      </div>
      {modulesLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module Name</TableHead>
              <TableHead>Accessibility</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Completion Rate</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules?.map((module) => (
              <ModuleTableRow key={module.id} module={module} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
