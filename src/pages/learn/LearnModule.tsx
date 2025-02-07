
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { ModuleNavigation } from "@/components/learn/ModuleNavigation";
import { ModuleContent } from "@/components/learn/ModuleContent";
import { ModuleNotFound } from "@/components/learn/ModuleNotFound";
import { ModuleCompletion } from "@/components/learn/ModuleCompletion";
import { useModuleLearning } from "@/hooks/useModuleLearning";
import { RouterNodeData } from "@/types/module";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [overlayRouter, setOverlayRouter] = useState<RouterNodeData | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const playlistModuleId = new URLSearchParams(location.search).get("playlist_module_id");

  const {
    module,
    isModuleLoading,
    progress,
    isProgressLoading,
    updateProgress,
  } = useModuleLearning(id, user?.id);

  // Query to get next module in playlist if this module is part of a playlist
  const { data: nextModule } = useQuery({
    queryKey: ["next-module", playlistModuleId],
    queryFn: async () => {
      if (!playlistModuleId) return null;

      const { data: currentModule } = await supabase
        .from("playlist_modules")
        .select("position, playlist_id")
        .eq("id", playlistModuleId)
        .single();

      if (!currentModule) return null;

      const { data: nextModule } = await supabase
        .from("playlist_modules")
        .select("id, module:modules(id)")
        .eq("playlist_id", currentModule.playlist_id)
        .eq("position", currentModule.position + 1)
        .single();

      return nextModule;
    },
    enabled: !!playlistModuleId,
  });

  // Initialize progress if none exists
  useEffect(() => {
    if (
      !isProgressLoading &&
      !progress &&
      user &&
      module?.nodes.length > 0
    ) {
      updateProgress(module.nodes[0].id);
    }
  }, [isProgressLoading, progress, user, module]);

  // Function to pause all media content
  const pauseAllMedia = () => {
    // Pause video if it exists and is playing
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      if (!video.paused) {
        video.pause();
      }
    });

    // Pause audio if it exists and is playing
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  };

  const handleNext = () => {
    if (!module?.nodes) return;

    const nextIndex = currentNodeIndex + 1;
    
    // If we're at the last node, show completion page
    if (nextIndex === module.nodes.length) {
      setShowCompletion(true);
      return;
    }

    if (nextIndex < module.nodes.length) {
      const nextNode = module.nodes[nextIndex];
      
      // If next node is a router with overlay, show it without changing the page
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
        updateProgress(nextNode.id);
        return;
      }

      setCurrentNodeIndex(nextIndex);
      updateProgress(nextNode.id);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  };

  const handleRouterChoice = (choiceIndex: number) => {
    if (!module?.nodes || overlayRouter === null) return;
    
    const currentRouterIndex = currentNodeIndex + 1;
    const nextIndex = currentRouterIndex + 1;
    
    // Clear the current overlay
    setOverlayRouter(null);
    
    if (nextIndex < module.nodes.length) {
      const nextNode = module.nodes[nextIndex];
      
      // If the next node is also an overlay router, show it without advancing
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
        updateProgress(nextNode.id);
      } else {
        // If it's not an overlay router, advance to the next page
        setCurrentNodeIndex(nextIndex);
        updateProgress(nextNode.id);
      }
    }
  };

  if (isModuleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mb-8" />
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    );
  }

  if (!module || !module.nodes || module.nodes.length === 0) {
    return <ModuleNotFound />;
  }

  if (showCompletion) {
    return (
      <ModuleCompletion 
        moduleId={module.id}
        playlistModuleId={playlistModuleId || undefined}
        hasNextModule={!!nextModule}
        onPlayNext={() => {
          if (nextModule?.module?.id) {
            window.location.href = `/learn/${nextModule.module.id}?playlist_module_id=${nextModule.id}`;
          }
        }}
      />
    );
  }

  const currentNode = module.nodes[currentNodeIndex];
  const isLastNode = currentNodeIndex === module.nodes.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <ModuleContent currentNode={currentNode} onRouterChoice={handleRouterChoice} />
        {overlayRouter && (
          <RouterNodeRenderer 
            data={overlayRouter}
            onChoiceSelect={handleRouterChoice}
          />
        )}
        <ModuleNavigation
          currentIndex={currentNodeIndex}
          totalNodes={module.nodes.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isLastNode={isLastNode}
        />
      </main>
    </div>
  );
};

export default LearnModule;
