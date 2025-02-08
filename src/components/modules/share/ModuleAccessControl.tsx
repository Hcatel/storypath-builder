
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
    mutationFn: async (newAccessType: ModuleAccessType) => {
      if (isCreateMode) {
        toast({
          title: "Info",
          description: "Save the module first before changing access settings",
        });
        return;
      }

      console.log('Updating access type:', { moduleId, newAccessType });
      
      const { data, error } = await supabase
        .from("modules")
        .update({ access_type: newAccessType })
        .eq("id", moduleId)
        .select();

      if (error) {
        console.error('Error updating access type:', error);
        throw error;
      }

      console.log('Update response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Update successful:', data);
      toast({
        title: "Success",
        description: "Access settings updated successfully",
      });
      onAccessChange();
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
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
