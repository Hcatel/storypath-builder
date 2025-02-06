
import { Header } from "@/components/Header";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { CreatePlaylistForm } from "@/components/playlist/CreatePlaylistForm";
import { PlaylistBreadcrumb } from "@/components/playlist/PlaylistBreadcrumb";

export default function CreatePlaylist() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1 p-6">
          <PlaylistBreadcrumb currentPage="Create New Playlist" />
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New Playlist</h1>
            <CreatePlaylistForm />
          </div>
        </main>
      </div>
    </div>
  );
}
