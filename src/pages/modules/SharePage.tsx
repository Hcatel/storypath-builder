
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

type ModuleAccessType = 'private' | 'public' | 'restricted';

export default function SharePage() {
  const { id } = useParams();
  const { toast } = useToast();
  const isCreateMode = !id || id === 'create';

  // Fetch module data only in edit mode
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        toast({
          title: "Create mode",
          description: "Please save your module first to manage sharing settings.",
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !isCreateMode,
  });

  // Update access type mutation
  const { mutate: updateAccessType } = useMutation({
    mutationFn: async (accessType: ModuleAccessType) => {
      if (isCreateMode) {
        toast({
          title: "Create mode",
          description: "Please save your module first to manage sharing settings.",
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

  if (isCreateMode) {
    return (
      <div className="container max-w-4xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Share & Access</CardTitle>
            <CardDescription>
              Save your module first to manage sharing settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              After creating your module, you'll be able to:
            </p>
            <ul className="list-disc ml-6 mt-2 text-muted-foreground">
              <li>Control who can access your module</li>
              <li>Share it with specific users or groups</li>
              <li>Get a shareable link</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Share & Access</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>
            Choose who can view and interact with this module
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Select
              value={module?.access_type || "private"}
              onValueChange={(value: ModuleAccessType) => updateAccessType(value)}
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
              {module?.access_type === "private" && (
                <p>Only you can access this module</p>
              )}
              {module?.access_type === "public" && (
                <p>Anyone can access this module</p>
              )}
              {module?.access_type === "restricted" && (
                <p>Only specific users or groups can access this module</p>
              )}
            </div>
          </div>

          {module?.access_type === "restricted" && (
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
    </div>
  );
}
