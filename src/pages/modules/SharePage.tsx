
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe2, Lock, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ModuleAccessType = 'private' | 'public' | 'restricted';

export default function SharePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const isCreateMode = !id || id === 'create';

  // Fetch module data
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        return {
          access_type: 'private' as ModuleAccessType,
          published: false,
          id: 'create'
        };
      }

      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Update access type mutation
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
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Access settings updated successfully",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update access settings: " + error.message,
      });
    },
  });

  // Update publish status mutation
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
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module publish status updated successfully",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update publish status: " + error.message,
      });
    },
  });

  if (isLoading && !isCreateMode) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Share & Access</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Status</CardTitle>
          <CardDescription>
            Control the visibility and publish status of your module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Switch
              id="publish-status"
              checked={module?.published || false}
              onCheckedChange={(checked) => updatePublishStatus(checked)}
              disabled={isCreateMode}
            />
            <div className="space-y-1">
              <Label htmlFor="publish-status">
                {module?.published ? "Published" : "Draft"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {module?.published
                  ? "This module is live and can be viewed by others based on access settings"
                  : "This module is in draft mode and only visible to you"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              value={module?.access_type || "private"}
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
                  {module?.access_type === "private" && (
                    <p>Only you can access this module</p>
                  )}
                  {module?.access_type === "public" && (
                    <p>Anyone can access this module</p>
                  )}
                  {module?.access_type === "restricted" && (
                    <p>Only specific users or groups can access this module</p>
                  )}
                </>
              )}
            </div>
          </div>

          {module?.access_type === "restricted" && !isCreateMode && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Manage Access</CardTitle>
                <CardDescription>
                  Add users or groups who can access this module
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Add Users or Groups
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {!isCreateMode && (
        <Card>
          <CardHeader>
            <CardTitle>Share Link</CardTitle>
            <CardDescription>
              Share this module directly using a link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/modules/${id}`}
                readOnly
                className="flex-1 px-3 py-2 bg-muted rounded-md text-sm"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/modules/${id}`
                  );
                  toast({
                    title: "Link copied",
                    description: "Module link copied to clipboard",
                  });
                }}
              >
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
