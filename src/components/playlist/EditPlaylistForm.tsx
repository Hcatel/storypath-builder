
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlaylistFormFields } from "./form/PlaylistFormFields";
import { AccessTypeSelect } from "./form/AccessTypeSelect";
import { ThumbnailUpload } from "./form/ThumbnailUpload";

type AccessType = "private" | "public" | "restricted";

interface FormData {
  name: string;
  description: string;
  accessType: AccessType;
}

interface EditPlaylistFormProps {
  playlist?: {
    id: string;
    name: string;
    description: string | null;
    access_type: AccessType | null;
    thumbnail_url: string | null;
  } | null;
  isCreateMode?: boolean;
}

export function EditPlaylistForm({ playlist, isCreateMode = false }: EditPlaylistFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: playlist?.name || "",
    description: playlist?.description || "",
    accessType: playlist?.access_type || "private",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      let thumbnailUrl = playlist?.thumbnail_url;
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

      if (isCreateMode) {
        const { data: newPlaylist, error: insertError } = await supabase
          .from("playlists")
          .insert({
            name: formData.name,
            description: formData.description || null,
            access_type: formData.accessType,
            thumbnail_url: thumbnailUrl,
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        toast({
          title: "Success",
          description: "Playlist created successfully",
        });

        navigate(`/playlists/${newPlaylist.id}`);
      } else {
        const { error: updateError } = await supabase
          .from("playlists")
          .update({
            name: formData.name,
            description: formData.description || null,
            access_type: formData.accessType,
            thumbnail_url: thumbnailUrl,
          })
          .eq("id", playlist?.id);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Playlist updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${isCreateMode ? 'create' : 'update'} playlist: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PlaylistFormFields
        name={formData.name}
        description={formData.description}
        onNameChange={(name) => setFormData({ ...formData, name })}
        onDescriptionChange={(description) => setFormData({ ...formData, description })}
      />

      <AccessTypeSelect
        value={formData.accessType}
        onChange={(accessType) => setFormData({ ...formData, accessType })}
      />

      <ThumbnailUpload
        initialThumbnailUrl={playlist?.thumbnail_url || null}
        onThumbnailChange={setThumbnail}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (isCreateMode ? "Creating..." : "Saving...") : (isCreateMode ? "Create Playlist" : "Save Changes")}
      </Button>
    </form>
  );
}
