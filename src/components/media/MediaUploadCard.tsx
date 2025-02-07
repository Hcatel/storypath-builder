
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MediaUploadCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      setUploading(true);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(`${user.id}/${file.name}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("media")
        .getPublicUrl(`${user.id}/${file.name}`);

      // Save to database
      const { error: dbError } = await supabase.from("media").insert([
        {
          user_id: user.id,
          filename: file.name,
          file_url: publicUrl.publicUrl,
          file_type: file.type,
          file_size: file.size,
        },
      ]);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload file: " + error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>
          Supported formats: images, videos, audio, and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
