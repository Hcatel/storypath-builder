
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
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    console.log("📌 Expected next node:", currentNode.data.nextNodeId || "None");
    
    const nextIndex = currentNodeIndex + 1;
    
    if (nextIndex === nodes.length) {
      console.log("🎉 Reached end of module");
      setShowCompletion(true);
      return;
    }

    if (nextIndex < nodes.length) {
      const nextNode = nodes[nextIndex];
      console.log("➡️ Moving to node:", nextNode.id, "of type:", nextNode.type);
      
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        console.log("🎭 Activating overlay router:", nextNode.id);
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
    if (!nodes) return;
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    console.log("📌 Expected next node:", currentNode.data.nextNodeId || "None");
    
    if (currentNodeIndex > 0) {
      const previousNode = nodes[currentNodeIndex - 1];
      console.log("⬅️ Moving back to node:", previousNode.id, "of type:", previousNode.type);
      setCurrentNodeIndex(currentNodeIndex - 1);
      setHasInteracted(false);
    }
  };

  const handleInteraction = () => {
    if (!nodes) return;
    const currentNode = nodes[currentNodeIndex];
    console.log("👆 User interacted with node:", currentNode.id, "of type:", currentNode.type);
    console.log("📌 Expected next node:", currentNode.data.nextNodeId || "None");
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
