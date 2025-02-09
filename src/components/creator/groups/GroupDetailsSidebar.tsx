
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings, Users, BookOpen } from "lucide-react";

interface GroupDetailsSidebarProps {
  groupId?: string;
}

export function GroupDetailsSidebar({ groupId }: GroupDetailsSidebarProps) {
  const items = [
    {
      title: "Details",
      icon: Users,
      path: `/creator/groups/${groupId}`,
      description: "Basic information",
    },
    {
      title: "Available Content",
      icon: BookOpen,
      path: `/creator/groups/${groupId}/content`,
      description: "Manage content access",
    },
    {
      title: "Settings",
      icon: Settings,
      path: `/creator/groups/${groupId}/settings`,
      description: "Group settings",
    },
  ];

  return (
    <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <NavLink to="/creator/learners" className="hover:text-foreground">
          Groups
        </NavLink>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Group Editor</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div>
            <h3 className="font-semibold">Group</h3>
            <p className="text-xs text-muted-foreground">Manage your group</p>
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
