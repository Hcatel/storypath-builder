
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ModuleStatusToggleProps {
  moduleId: string;
  published: boolean;
  isCreateMode: boolean;
  onStatusChange: () => void;
}

export function ModuleStatusToggle({
  moduleId,
  published,
  isCreateMode,
  onStatusChange,
}: ModuleStatusToggleProps) {
  const { toast } = useToast();

  const { mutate: updatePublishStatus } = useMutation({
    mutationFn: async (published: boolean) => {
      if (isCreateMode) {
        toast({
          title: "Info",
          description: "Save the module first before publishing",
        });
        return;
      }

      const { error } = await supabase
        .from("modules")
        .update({ published })
        .eq("id", moduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module publish status updated successfully",
      });
      onStatusChange();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update publish status: " + error.message,
      });
    },
  });

  return (
    <div className="flex items-center space-x-4">
      <Switch
        id="publish-status"
        checked={published}
        onCheckedChange={(checked) => updatePublishStatus(checked)}
        disabled={isCreateMode}
      />
      <div className="space-y-1">
        <Label htmlFor="publish-status">
          {published ? "Published" : "Draft"}
        </Label>
        <p className="text-sm text-muted-foreground">
          {published
            ? "This module is live and can be viewed by others based on access settings"
            : "This module is in draft mode and only visible to you"}
        </p>
      </div>
    </div>
  );
}
