
import { NavLink } from "react-router-dom";
import { BarChart2, FileText, Layout } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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
    <Sidebar className="border-r border-border bg-sidebar-background w-56">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1 p-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex flex-col space-y-1 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "bg-accent/60 text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <span className="line-clamp-1 text-xs opacity-70">
                      {item.description}
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
