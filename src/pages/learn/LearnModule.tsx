
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { ModuleNavigation } from "@/components/learn/ModuleNavigation";
import { ModuleContent } from "@/components/learn/ModuleContent";
import { ModuleNotFound } from "@/components/learn/ModuleNotFound";
import { ModuleCompletion } from "@/components/learn/ModuleCompletion";
import { ModuleLoading } from "@/components/learn/ModuleLoading";
import { useModuleLearning } from "@/hooks/useModuleLearning";
import { RouterNodeData } from "@/types/module";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";
import { useMediaControl } from "@/hooks/useMediaControl";
import { useNextModuleInPlaylist } from "@/hooks/useNextModuleInPlaylist";

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [overlayRouter, setOverlayRouter] = useState<RouterNodeData | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const location = useLocation();
  const playlistModuleId = new URLSearchParams(location.search).get("playlist_module_id");
  const { pauseAllMedia } = useMediaControl();

  const {
    module,
    isModuleLoading,
    progress,
    isProgressLoading,
    updateProgress,
  } = useModuleLearning(id, user?.id);

  const { data: nextModule } = useNextModuleInPlaylist(playlistModuleId);

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

  const canProceed = () => {
    if (!module?.nodes) return false;
    const currentNode = module.nodes[currentNodeIndex];
    
    // If the node is required and there's been no interaction, prevent proceeding
    if (currentNode.data.isRequired && !hasInteracted) {
      return false;
    }
    
    return true;
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
      setHasInteracted(false); // Reset interaction state for new node
      updateProgress(nextNode.id);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
      setHasInteracted(false); // Reset interaction state for new node
    }
  };

  const handleInteraction = () => {
    setHasInteracted(true);
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
        setHasInteracted(false); // Reset interaction state for new node
        updateProgress(nextNode.id);
      }
    }
  };

  if (isModuleLoading) {
    return <ModuleLoading />;
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
        <ModuleContent 
          currentNode={currentNode} 
          onRouterChoice={handleRouterChoice}
          onInteraction={handleInteraction}
        />
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
          canProceed={canProceed()}
        />
      </main>
    </div>
  );
};

export default LearnModule;
