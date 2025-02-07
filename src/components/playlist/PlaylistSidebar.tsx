
import { NavLink, Link } from "react-router-dom";
import { BarChart2, FileText, Layout, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistSidebarProps {
  playlistId?: string;
}

export function PlaylistSidebar({ playlistId }: PlaylistSidebarProps) {
  const items = [
    {
      title: "Details",
      icon: FileText,
      path: playlistId ? `/playlists/${playlistId}` : "#",
      description: "Basic information",
    },
    {
      title: "Content",
      icon: Layout,
      path: playlistId ? `/playlists/${playlistId}/content` : "#",
      description: "Manage modules",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      path: playlistId ? `/playlists/${playlistId}/analytics` : "#",
      description: "View performance",
    },
  ];

  return (
    <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/creator/content?tab=playlists" className="hover:text-foreground">
          Playlists
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Playlist Editor</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div>
            <h3 className="font-semibold">Playlist</h3>
            <p className="text-xs text-muted-foreground">Manage your playlist</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.title === "Details"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                "transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent/60 text-accent-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
