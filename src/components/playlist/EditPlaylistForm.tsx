
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AccessType = "private" | "public" | "restricted";

interface FormData {
  name: string;
  description: string;
  accessType: AccessType;
}

interface EditPlaylistFormProps {
  playlist: {
    id: string;
    name: string;
    description: string | null;
    access_type: AccessType | null;
    thumbnail_url: string | null;
  };
}

export function EditPlaylistForm({ playlist }: EditPlaylistFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: playlist.name,
    description: playlist.description || "",
    accessType: playlist.access_type || "private",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    playlist.thumbnail_url
  );

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      let thumbnailUrl = playlist.thumbnail_url;
      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("playlist-thumbnails")
          .upload(filePath, thumbnail);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("playlist-thumbnails")
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("playlists")
        .update({
          name: formData.name,
          description: formData.description || null,
          access_type: formData.accessType,
          thumbnail_url: thumbnailUrl,
        })
        .eq("id", playlist.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Playlist updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update playlist: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Enter playlist name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter playlist description"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessType">Access Type</Label>
        <Select
          value={formData.accessType}
          onValueChange={(value: AccessType) =>
            setFormData({ ...formData, accessType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select access type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="restricted">Restricted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <div className="flex items-center gap-4">
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="h-20 w-20 object-cover rounded"
            />
          )}
          <div>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("thumbnail")?.click()}
            >
              {thumbnailPreview ? "Change" : "Upload"} Thumbnail
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
