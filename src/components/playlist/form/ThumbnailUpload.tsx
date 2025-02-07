
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ThumbnailUploadProps {
  initialThumbnailUrl: string | null;
  onThumbnailChange: (file: File | null) => void;
}

export function ThumbnailUpload({ 
  initialThumbnailUrl, 
  onThumbnailChange 
}: ThumbnailUploadProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialThumbnailUrl
  );

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onThumbnailChange(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  return (
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
  );
}
