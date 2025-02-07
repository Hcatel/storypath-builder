import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { ModuleNavigation } from "@/components/learn/ModuleNavigation";
import { ModuleContent } from "@/components/learn/ModuleContent";
import { ModuleNotFound } from "@/components/learn/ModuleNotFound";
import { useModuleLearning } from "@/hooks/useModuleLearning";
import { RouterNodeData } from "@/types/module";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [overlayRouter, setOverlayRouter] = useState<RouterNodeData | null>(null);

  const {
    module,
    isModuleLoading,
    progress,
    isProgressLoading,
    updateProgress,
  } = useModuleLearning(id, user?.id);

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

  const handleNext = () => {
    if (!module?.nodes) return;

    const nextIndex = currentNodeIndex + 1;
    if (nextIndex < module.nodes.length) {
      const nextNode = module.nodes[nextIndex];
      
      // If next node is a router with overlay, show it without changing the page
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
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
    if (overlayRouter) {
      setOverlayRouter(null);
      setCurrentNodeIndex(currentNodeIndex + 1);
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

  const currentNode = module.nodes[currentNodeIndex];

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
        />
      </main>
    </div>
  );
};

export default LearnModule;
