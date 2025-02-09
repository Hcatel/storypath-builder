import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart2, BookOpen, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/creator/dashboard",
    icon: BookOpen,
  },
  {
    name: "Content",
    href: "/creator/content",
    icon: BookOpen,
  },
  {
    name: "Learners",
    href: "/creator/learners",
    icon: Users,
  },
  {
    name: "Analytics",
    href: "/creator/analytics",
    icon: BarChart2,
  },
  {
    name: "Nest Settings",
    href: "/creator/settings",
    icon: Settings,
  },
];

export function CreatorSidebar() {
  return (
    <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div>
            <h3 className="font-semibold">Your Nest</h3>
            <p className="text-xs text-muted-foreground">@username</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
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
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          Feedback
        </Button>
      </div>
    </div>
  );
}
