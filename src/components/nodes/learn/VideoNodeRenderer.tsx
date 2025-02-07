
import { useState, useRef, useEffect } from "react";
import { VideoNodeData } from "@/types/module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Volume2, VolumeX, Play, Pause, Subtitles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoNodeRendererProps {
  data: VideoNodeData;
}

export function VideoNodeRenderer({ data }: VideoNodeRendererProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('play', () => setIsPlaying(true));
      videoRef.current.addEventListener('pause', () => setIsPlaying(false));
      videoRef.current.addEventListener('ended', () => setIsPlaying(false));

      // Handle autoplay
      if (data.autoplay) {
        videoRef.current.play().catch(error => {
          console.log("Autoplay failed:", error);
        });
      }
    }
  }, [data.autoplay]);

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

  const thumbnailUrl = data.thumbnailUrl || "/placeholder.svg";

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Play failed:", error);
          });
        }
      }
    }
  };

  return (
    <Card className="max-w-4xl w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{data.title}</CardTitle>
        <div className="flex gap-2">
          {data.showVolume && (
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
          )}
          {data.showPlayPause && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayPause}
              title={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          {data.showSubtitles && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSubtitles(!showSubtitles)}
              title={showSubtitles ? "Hide subtitles" : "Show subtitles"}
            >
              <Subtitles className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="aspect-video rounded-lg overflow-hidden bg-black relative cursor-pointer group"
          onClick={() => !isPlaying && (!data.autoplay || data.showPlayPause) && handlePlayPause()}
        >
          {!isPlaying && (
            <>
              <img 
                src={thumbnailUrl} 
                alt={data.title} 
                className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              {(!data.autoplay || data.showPlayPause) && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-90 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-6 w-6" />
                </Button>
              )}
            </>
          )}
          <video
            ref={videoRef}
            src={data.videoUrl}
            className={`w-full h-full ${!isPlaying ? 'hidden' : ''}`}
            autoPlay={data.autoplay}
            muted={isMuted}
            playsInline
            controls={data.showSeeking}
          >
            {showSubtitles && <track kind="captions" />}
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
