
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
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE = 1024 * 1024 * 50; // 50MB in bytes - Supabase limit for direct upload

export function MediaUploadCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Check file size before attempting upload
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB due to current limitations`);
      }

      setUploading(true);
      setUploadProgress(0);

      // Sanitize filename to remove special characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

      // Create blob from file to track upload progress
      const fileBlob = new Blob([file], { type: file.type });
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from("media")
        .upload(`${user.id}/${uniqueFileName}`, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(`${user.id}/${uniqueFileName}`);

      // Save to database
      const { error: dbError } = await supabase.from("media").insert([
        {
          user_id: user.id,
          filename: file.name,
          file_url: publicUrl,
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
      console.error("Full error details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset input
      event.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>
          Supported formats: images, videos, audio, and documents (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
              accept="video/*,image/*,audio/*,.pdf,.doc,.docx"
            />
            {uploading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
          {uploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
