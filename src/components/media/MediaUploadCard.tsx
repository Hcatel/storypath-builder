
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

const MAX_FILE_SIZE = 512 * 1024 * 1024; // 512MB in bytes

export function MediaUploadCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Check file size before attempting upload
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      setUploading(true);

      // Sanitize filename to remove special characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

      // Upload to storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(`${user.id}/${uniqueFileName}`, file, {
          cacheControl: "3600",
          upsert: true, // Allow overwriting in case of retry
          contentType: file.type
        });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        
        // More specific error messages based on status code
        if (uploadError.statusCode === "413") {
          throw new Error("File size exceeds the server's limit. Please try a smaller file or compress this one.");
        }
        throw new Error(uploadError.message || "Failed to upload file");
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("media")
        .getPublicUrl(`${user.id}/${uniqueFileName}`);

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
      console.error("Full error details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
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
          Supported formats: images, videos, audio, and documents (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
