
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CreatorContent() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["creator-modules"],
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
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return data;
    },
  });

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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Content</h1>
          </div>
          <Tabs defaultValue="modules" className="space-y-6">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="modules">
              <div className="flex justify-end mb-4">
                <Link to="/modules/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Module
                  </Button>
                </Link>
              </div>
              {isLoading ? (
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
                      <TableRow key={module.id}>
                        <TableCell className="font-medium">{module.title}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="playlists">
              <div className="text-center text-muted-foreground p-8">
                Playlists section coming soon
              </div>
            </TabsContent>

            <TabsContent value="media">
              <div className="text-center text-muted-foreground p-8">
                Media section coming soon
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
