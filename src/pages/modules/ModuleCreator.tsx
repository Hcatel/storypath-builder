
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModuleCreatorSidebar } from "@/components/module-creator/ModuleCreatorSidebar";
import { Outlet, useParams } from "react-router-dom";
import { Header } from "@/components/Header";

export default function ModuleCreator() {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <SidebarProvider>
          <div className="flex w-full">
            <ModuleCreatorSidebar moduleId={id} />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
