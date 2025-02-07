
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Globe2, Lock, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type ModuleAccessType = 'private' | 'public' | 'restricted';

interface ModuleAccessControlProps {
  moduleId: string;
  accessType: ModuleAccessType;
  isCreateMode: boolean;
  onAccessChange: () => void;
}

export function ModuleAccessControl({
  moduleId,
  accessType,
  isCreateMode,
  onAccessChange,
}: ModuleAccessControlProps) {
  const { toast } = useToast();

  const { mutate: updateAccessType } = useMutation({
    mutationFn: async (accessType: ModuleAccessType) => {
      if (isCreateMode) {
        toast({
          title: "Info",
          description: "Save the module first before changing access settings",
        });
        return;
      }

      const { error } = await supabase
        .from("modules")
        .update({ access_type: accessType })
        .eq("id", moduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Access settings updated successfully",
      });
      onAccessChange();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update access settings: " + error.message,
      });
    },
  });

  return (
    <div className="space-y-4">
      <Select
        value={accessType}
        onValueChange={(value: ModuleAccessType) => updateAccessType(value)}
        disabled={isCreateMode}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select access type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Private</span>
            </div>
          </SelectItem>
          <SelectItem value="public">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <span>Public</span>
            </div>
          </SelectItem>
          <SelectItem value="restricted">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Restricted</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="text-sm text-muted-foreground">
        {isCreateMode ? (
          <p>Save the module first to configure access settings</p>
        ) : (
          <>
            {accessType === "private" && <p>Only you can access this module</p>}
            {accessType === "public" && <p>Anyone can access this module</p>}
            {accessType === "restricted" && (
              <p>Only specific users or groups can access this module</p>
            )}
          </>
        )}
      </div>

      {accessType === "restricted" && !isCreateMode && (
        <Card>
          <CardContent className="pt-6">
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Users or Groups
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
