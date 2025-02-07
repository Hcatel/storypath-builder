
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VideoNodeData } from "@/types/module";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaTable } from "@/components/media/MediaTable";
import { MediaUploadCard } from "@/components/media/MediaUploadCard";
import { Video, Image } from "lucide-react";

type VideoNodeDetailsProps = {
  data: VideoNodeData;
  onUpdate: (updates: Partial<VideoNodeData>) => void;
};

export function VideoNodeDetails({ data, onUpdate }: VideoNodeDetailsProps) {
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isThumbDialogOpen, setIsThumbDialogOpen] = useState(false);

  const handleMediaSelect = (fileUrl: string) => {
    onUpdate({ ...data, videoUrl: fileUrl });
    setIsMediaDialogOpen(false);
  };

  const handleThumbnailSelect = (fileUrl: string) => {
    onUpdate({ ...data, thumbnailUrl: fileUrl });
    setIsThumbDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={data.title}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="Enter video title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Video</label>
        <div className="flex flex-col gap-4">
          {data.videoUrl && (
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <iframe 
                src={data.videoUrl} 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex gap-2">
            <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Video className="h-4 w-4" />
                  {data.videoUrl ? "Change Video" : "Select Video"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90vw]">
                <DialogHeader>
                  <DialogTitle>Select or Upload Video</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <MediaUploadCard />
                  <MediaTable onSelect={handleMediaSelect} />
                </div>
              </DialogContent>
            </Dialog>
            {data.videoUrl && (
              <Button 
                variant="outline" 
                onClick={() => onUpdate({ ...data, videoUrl: "" })}
              >
                Remove Video
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter video URL directly</label>
            <Input
              value={data.videoUrl}
              onChange={(e) => onUpdate({ ...data, videoUrl: e.target.value })}
              placeholder="Enter video URL"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Custom Thumbnail</label>
        <div className="flex flex-col gap-4">
          {data.thumbnailUrl && (
            <div className="aspect-video bg-muted rounded-md overflow-hidden">
              <img 
                src={data.thumbnailUrl} 
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex gap-2">
            <Dialog open={isThumbDialogOpen} onOpenChange={setIsThumbDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Image className="h-4 w-4" />
                  {data.thumbnailUrl ? "Change Thumbnail" : "Select Thumbnail"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90vw]">
                <DialogHeader>
                  <DialogTitle>Select or Upload Thumbnail</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <MediaUploadCard />
                  <MediaTable onSelect={handleThumbnailSelect} />
                </div>
              </DialogContent>
            </Dialog>
            {data.thumbnailUrl && (
              <Button 
                variant="outline" 
                onClick={() => onUpdate({ ...data, thumbnailUrl: "" })}
              >
                Remove Thumbnail
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter thumbnail URL directly</label>
            <Input
              value={data.thumbnailUrl || ""}
              onChange={(e) => onUpdate({ ...data, thumbnailUrl: e.target.value })}
              placeholder="Enter thumbnail URL"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
