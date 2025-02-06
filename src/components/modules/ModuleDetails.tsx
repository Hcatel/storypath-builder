
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ModuleDetailsProps {
  moduleId: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  onUpdate: (values: { title?: string; description?: string; thumbnail_url?: string }) => void;
}

export function ModuleDetails({ moduleId, title, description, thumbnailUrl, onUpdate }: ModuleDetailsProps) {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${moduleId}/thumbnail.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onUpdate({ thumbnail_url: publicUrl });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload thumbnail: " + error.message,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter module title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Enter module description"
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Thumbnail</label>
          <div className="flex items-center gap-4">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
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
                {thumbnailUrl ? "Change" : "Upload"} Thumbnail
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
