
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
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

export default function CreatePlaylist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessType: "private",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      let thumbnailUrl = null;
      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

        // Upload thumbnail to storage
        const { error: uploadError } = await supabase.storage
          .from("playlist-thumbnails")
          .upload(filePath, thumbnail);

        if (uploadError) throw uploadError;

        // Get public URL for the uploaded thumbnail
        const { data: { publicUrl } } = supabase.storage
          .from("playlist-thumbnails")
          .getPublicUrl(filePath);

        thumbnailUrl = publicUrl;
      }

      // Create playlist record
      const { data: playlist, error: insertError } = await supabase
        .from("playlists")
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            access_type: formData.accessType,
            thumbnail_url: thumbnailUrl,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Playlist created successfully",
      });

      // Navigate to the playlist detail page
      navigate(`/playlists/${playlist.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create playlist: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Playlist</h1>
          
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
                onValueChange={(value) =>
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
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
