
import { UploadCloud, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface MediaTableProps {
  onSelect?: (fileUrl: string) => void;
}

export function MediaTable({ onSelect }: MediaTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mediaFiles?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No media files yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first file to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  const isVideoFile = (fileType: string) => {
    return fileType.startsWith('video/') || fileType.includes('video');
  };

  return (
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
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaFiles.map((file) => (
                <TableRow 
                  key={file.id}
                  className={onSelect && isVideoFile(file.file_type) ? "cursor-pointer hover:bg-accent" : undefined}
                  onClick={() => {
                    if (onSelect && isVideoFile(file.file_type)) {
                      onSelect(file.file_url);
                    }
                  }}
                >
                  <TableCell className="font-medium">{file.filename}</TableCell>
                  <TableCell>{file.file_type}</TableCell>
                  <TableCell>{formatFileSize(file.file_size)}</TableCell>
                  <TableCell>
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {onSelect && isVideoFile(file.file_type) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(file.file_url);
                          }}
                        >
                          Select
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(file.id);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
