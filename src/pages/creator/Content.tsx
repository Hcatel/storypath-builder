
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { ModulesTable } from "@/components/creator/content/ModulesTable";
import { PlaylistsTable } from "@/components/creator/content/PlaylistsTable";
import MediaPage from "@/pages/modules/MediaPage";
import { useSearchParams } from "react-router-dom";

export default function CreatorContent() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "modules";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Content</h1>
          </div>
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="modules">
              <ModulesTable />
            </TabsContent>

            <TabsContent value="playlists">
              <PlaylistsTable />
            </TabsContent>

            <TabsContent value="media">
              <MediaPage />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
