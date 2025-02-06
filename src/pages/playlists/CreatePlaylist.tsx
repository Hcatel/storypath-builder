
import { Header } from "@/components/Header";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { CreatePlaylistForm } from "@/components/playlist/CreatePlaylistForm";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CreatePlaylist() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/creator/content?tab=playlists" className="hover:text-foreground">
              Content
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Create Playlist</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-10 h-10 rounded-full bg-primary/20" />
              <div>
                <h3 className="font-semibold">New Playlist</h3>
                <p className="text-xs text-muted-foreground">Create your playlist</p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Create New Playlist</h1>
            <CreatePlaylistForm />
          </div>
        </main>
      </div>
    </div>
  );
}
