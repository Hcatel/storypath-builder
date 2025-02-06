
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, BarChart3, Globe2, Lock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SummaryPage() {
  const { id } = useParams();
  const { toast } = useToast();

  // Fetch module data
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update module mutation
  const { mutate: updateModule } = useMutation({
    mutationFn: async (values: {
      title?: string;
      description?: string;
      thumbnail_url?: string;
    }) => {
      const { error } = await supabase
        .from("modules")
        .update(values)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Module updated successfully",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update module: " + error.message,
      });
    },
  });

  // Check for errors function
  const checkForErrors = () => {
    const errors = [];

    if (!module?.title) {
      errors.push("Module title is required");
    }

    if (!module?.nodes || !Array.isArray(module.nodes) || module.nodes.length === 0) {
      errors.push("Module must have at least one content node");
    }

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Module has errors",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
    } else {
      toast({
        title: "Success",
        description: "No errors found in your module",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}/thumbnail.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      updateModule({ thumbnail_url: publicUrl });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload thumbnail: " + error.message,
      });
    }
  };

  const handleSave = () => {
    updateModule({
      title: module?.title,
      description: module?.description
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Module Summary</h1>
        <div className="flex gap-2">
          <Button onClick={checkForErrors} variant="outline">
            Check for Errors
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Module Details */}
        <Card>
          <CardHeader>
            <CardTitle>Module Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={module?.title || ""}
                onChange={(e) => updateModule({ title: e.target.value })}
                placeholder="Enter module title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={module?.description || ""}
                onChange={(e) => updateModule({ description: e.target.value })}
                placeholder="Enter module description"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail</label>
              <div className="flex items-center gap-4">
                {module?.thumbnail_url && (
                  <img
                    src={module.thumbnail_url}
                    alt="Module thumbnail"
                    className="h-20 w-20 object-cover rounded"
                  />
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  >
                    {module?.thumbnail_url ? "Change" : "Upload"} Thumbnail
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {module?.published ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-yellow-500" />
                )}
                <span>
                  {module?.published ? "Published" : "Draft"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <BarChart3 className="text-muted-foreground" />
                <span>Coming soon</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {module?.access_type === "public" ? (
                  <Globe2 className="text-muted-foreground" />
                ) : (
                  <Lock className="text-muted-foreground" />
                )}
                <span className="capitalize">{module?.access_type || "private"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
