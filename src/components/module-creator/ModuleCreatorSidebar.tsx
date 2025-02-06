
import { FileText, Code, Image, Share2, ChartBar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface ModuleCreatorSidebarProps {
  moduleId: string;
}

export function ModuleCreatorSidebar({ moduleId }: ModuleCreatorSidebarProps) {
  const items = [
    {
      title: "Summary",
      icon: FileText,
      path: `/modules/${moduleId}/summary`,
    },
    {
      title: "Build",
      icon: Code,
      path: `/modules/${moduleId}/build`,
    },
    {
      title: "My Media",
      icon: Image,
      path: `/modules/${moduleId}/media`,
    },
    {
      title: "Share & Access",
      icon: Share2,
      path: `/modules/${moduleId}/share`,
    },
    {
      title: "Results",
      icon: ChartBar,
      path: `/modules/${moduleId}/results`,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
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
