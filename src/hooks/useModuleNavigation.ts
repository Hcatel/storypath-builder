
import { useState } from "react";
import { RouterNodeData, FlowNode } from "@/types/module";
import { useMediaControl } from "./useMediaControl";

export function useModuleNavigation(
  nodes: FlowNode[] | undefined,
  updateProgress: (nodeId: string) => void
) {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [overlayRouter, setOverlayRouter] = useState<RouterNodeData | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const { pauseAllMedia } = useMediaControl();

  const handleNext = () => {
    if (!nodes) return;
    
    const nextIndex = currentNodeIndex + 1;
    
    if (nextIndex === nodes.length) {
      setShowCompletion(true);
      return;
    }

    if (nextIndex < nodes.length) {
      const nextNode = nodes[nextIndex];
      
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
        updateProgress(nextNode.id);
        return;
      }

      setCurrentNodeIndex(nextIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
      setHasInteracted(false);
    }
  };

  const handleInteraction = () => {
    setHasInteracted(true);
  };

  return {
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
  };
}
