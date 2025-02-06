
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FileText, Code, Image, Share2, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleCreatorSidebarProps {
  moduleId: string;
}

const navigation = [
  {
    name: "Summary",
    href: (moduleId: string) => `/modules/${moduleId}/summary`,
    icon: FileText,
  },
  {
    name: "Build",
    href: (moduleId: string) => `/modules/${moduleId}/build`,
    icon: Code,
  },
  {
    name: "My Media",
    href: (moduleId: string) => `/modules/${moduleId}/media`,
    icon: Image,
  },
  {
    name: "Share & Access",
    href: (moduleId: string) => `/modules/${moduleId}/share`,
    icon: Share2,
  },
  {
    name: "Results",
    href: (moduleId: string) => `/modules/${moduleId}/results`,
    icon: ChartBar,
  },
];

export function ModuleCreatorSidebar({ moduleId }: ModuleCreatorSidebarProps) {
  return (
    <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20" />
          <div>
            <h3 className="font-semibold">Module Creator</h3>
            <p className="text-xs text-muted-foreground">Edit your module</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href(moduleId)}
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
          <FileText className="w-4 h-4 mr-2" />
          Documentation
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          Feedback
        </Button>
      </div>
    </div>
  );
}
