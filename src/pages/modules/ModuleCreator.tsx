
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModuleCreatorSidebar } from "@/components/module-creator/ModuleCreatorSidebar";
import { Outlet, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

export default function ModuleCreator({ children }: { children?: React.ReactNode }) {
  const { id } = useParams();
  const { toast } = useToast();
  const isCreateMode = !id || id === 'create';

  const { mutate: saveModule } = useMutation({
    mutationFn: async () => {
      if (isCreateMode) {
        toast({
          title: "Create mode",
          description: "Please fill in the module details and click 'Save' to create your module.",
        });
        return;
      }

      const { error } = await supabase
        .from("modules")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save module: " + error.message,
      });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <ModuleCreatorSidebar moduleId={id || ''} />
          <main className="flex-1 overflow-y-auto p-6 relative">
            {children || <Outlet />}
            {!isCreateMode && (
              <Button
                onClick={() => saveModule()}
                className="fixed bottom-6 right-6 shadow-lg"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Module
              </Button>
            )}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
