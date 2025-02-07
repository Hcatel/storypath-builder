
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

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB in bytes
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB chunks

export function MediaUploadCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const uploadLargeFile = async (file: File, uniqueFileName: string, userId: string) => {
    let offset = 0;
    let partNumber = 1;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    try {
      // Start multipart upload
      const { data: { uploadId }, error: initError } = await supabase.storage
        .from('media')
        .createMultipartUpload(`${userId}/${uniqueFileName}`);

      if (initError) throw initError;

      const uploadPromises = [];
      
      // Upload parts
      while (offset < file.size) {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        const { error: uploadPartError } = await supabase.storage
          .from('media')
          .uploadPart(`${userId}/${uniqueFileName}`, uploadId, partNumber, chunk);

        if (uploadPartError) throw uploadPartError;

        setUploadProgress(Math.min(((partNumber) / totalChunks) * 100, 99));
        
        offset += CHUNK_SIZE;
        partNumber++;
      }

      // Complete multipart upload
      const { error: completeError } = await supabase.storage
        .from('media')
        .completeMultipartUpload(`${userId}/${uniqueFileName}`, uploadId);

      if (completeError) throw completeError;

      setUploadProgress(100);
      return true;
    } catch (error) {
      console.error('Multipart upload error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      // Check file size before attempting upload
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }

      setUploading(true);
      setUploadProgress(0);

      // Sanitize filename to remove special characters
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

      // Use multipart upload for large files (> 50MB)
      if (file.size > 50 * 1024 * 1024) {
        await uploadLargeFile(file, uniqueFileName, user.id);
      } else {
        // Regular upload for smaller files
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(`${user.id}/${uniqueFileName}`, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type
          });

        if (uploadError) throw uploadError;
      }

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
