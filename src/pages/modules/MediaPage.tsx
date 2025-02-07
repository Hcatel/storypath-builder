
import { useState } from "react";
import { UploadCloud, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MediaFile {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export default function MediaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch media files
  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ["media-files"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MediaFile[];
    },
  });

  // Delete media file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const fileToDelete = mediaFiles?.find((f) => f.id === fileId);
      if (!fileToDelete) throw new Error("File not found");

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([`${user?.id}/${fileToDelete.filename}`]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("media")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete file: " + error.message,
        variant: "destructive",
      });
    },
  });

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

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Media</h2>
        <p className="text-muted-foreground">
          Upload and manage your media files here. They can be used in your
          modules and playlists.
        </p>
      </div>

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

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : mediaFiles?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No media files yet</p>
            <p className="text-sm text-muted-foreground">
              Upload your first file to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaFiles?.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">{file.filename}</TableCell>
                      <TableCell>{file.file_type}</TableCell>
                      <TableCell>{formatFileSize(file.file_size)}</TableCell>
                      <TableCell>
                        {new Date(file.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(file.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
