
import { Header } from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PlaylistSidebar } from "@/components/playlist/PlaylistSidebar";
import { CreatePlaylistForm } from "@/components/playlist/CreatePlaylistForm";
import { PlaylistBreadcrumb } from "@/components/playlist/PlaylistBreadcrumb";

export default function CreatePlaylist() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SidebarProvider>
        <div className="flex w-full">
          <PlaylistSidebar />
          <main className="flex-1 p-6">
            <PlaylistBreadcrumb currentPage="Create New Playlist" />
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-6">Create New Playlist</h1>
              <CreatePlaylistForm />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
