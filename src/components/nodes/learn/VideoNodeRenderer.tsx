
import { useState } from "react";
import { VideoNodeData } from "@/types/module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoNodeRendererProps {
  data: VideoNodeData;
}

export function VideoNodeRenderer({ data }: VideoNodeRendererProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!data.title || !data.videoUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid video node data: Missing title or video URL
        </AlertDescription>
      </Alert>
    );
  }

  // Function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    try {
      // Handle different YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    } catch (error) {
      console.error("Error extracting YouTube video ID:", error);
      return null;
    }
  };

  // Get YouTube embed URL
  const getEmbedUrl = () => {
    const videoId = getYouTubeVideoId(data.videoUrl);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}`;
    }
    // If not a YouTube URL, return the original URL
    return data.videoUrl;
  };

  // Use custom thumbnail if provided, otherwise try to get YouTube thumbnail
  const getDefaultThumbnail = () => {
    const videoId = getYouTubeVideoId(data.videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return "/placeholder.svg"; // Fallback to a placeholder image
  };

  const thumbnailUrl = data.thumbnailUrl || getDefaultThumbnail();

  return (
    <Card className="max-w-4xl w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{data.title}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="aspect-video rounded-lg overflow-hidden bg-black relative cursor-pointer group"
          onClick={() => !isPlaying && setIsPlaying(true)}
        >
          {!isPlaying ? (
            <>
              <img 
                src={thumbnailUrl} 
                alt={data.title} 
                className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                onError={(e) => {
                  // Fallback to placeholder if thumbnail fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <Button
                variant="secondary"
                size="lg"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 transition-opacity"
              >
                <Play className="h-6 w-6" />
              </Button>
            </>
          ) : (
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
