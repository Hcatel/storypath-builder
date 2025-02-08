
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { ModuleNavigation } from "@/components/learn/ModuleNavigation";
import { ModuleContent } from "@/components/learn/ModuleContent";
import { ModuleNotFound } from "@/components/learn/ModuleNotFound";
import { ModuleCompletion } from "@/components/learn/ModuleCompletion";
import { ModuleLoading } from "@/components/learn/ModuleLoading";
import { useModuleLearning } from "@/hooks/useModuleLearning";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";
import { useNextModuleInPlaylist } from "@/hooks/useNextModuleInPlaylist";
import { useModuleNavigation } from "@/hooks/useModuleNavigation";
import { useRouterHandling } from "@/hooks/useRouterHandling";

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const playlistModuleId = new URLSearchParams(location.search).get("playlist_module_id");

  const {
    module,
    isModuleLoading,
    progress,
    isProgressLoading,
    updateProgress,
  } = useModuleLearning(id, user?.id);

  const { data: nextModule } = useNextModuleInPlaylist(playlistModuleId);

  const {
    currentNodeIndex,
    setCurrentNodeIndex,
    overlayRouter,
    hasInteracted,
    setHasInteracted,
    showCompletion,
    setOverlayRouter,
    handleNext,
    handlePrevious,
    handleInteraction,
  } = useModuleNavigation(module?.nodes, updateProgress);

  const { handleRouterChoice } = useRouterHandling(
    module?.nodes,
    currentNodeIndex,
    updateProgress,
    setOverlayRouter,
    setCurrentNodeIndex,
    setHasInteracted
  );

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
    return !currentNode.data.isRequired || hasInteracted;
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
