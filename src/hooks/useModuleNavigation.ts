
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

  const findNodeById = (nodeId: string): FlowNode | null => {
    if (!nodes) return null;
    return nodes.find(node => node.id === nodeId) || null;
  };

  const findNodeIndex = (nodeId: string): number => {
    if (!nodes) return -1;
    return nodes.findIndex(node => node.id === nodeId);
  };

  const handleNext = () => {
    if (!nodes) return;
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    
    // Debug log to help diagnose the issue
    console.log("🔍 Full node data:", JSON.stringify(currentNode.data, null, 2));
    
    if (!currentNode.data?.nextNodeId) {
      console.log("🎉 Reached end of module - no next node defined");
      setShowCompletion(true);
      return;
    }

    const nextNode = findNodeById(currentNode.data.nextNodeId);
    if (!nextNode) {
      console.log("⚠️ Next node not found:", currentNode.data.nextNodeId);
      return;
    }

    console.log("📌 Found next node:", nextNode.id, "of type:", nextNode.type);

    const nextIndex = findNodeIndex(nextNode.id);
    if (nextIndex !== -1) {
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        console.log("🎭 Activating overlay router:", nextNode.id);
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
      } else {
        console.log("➡️ Moving to node:", nextNode.id, "of type:", nextNode.type);
        setCurrentNodeIndex(nextIndex);
        setHasInteracted(false);
      }
      // Only update progress after all state changes
      updateProgress(nextNode.id);
    } else {
      console.log("⚠️ Next node index not found for node:", nextNode.id);
    }
  };

  const handlePrevious = () => {
    if (!nodes) return;
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    
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
    console.log("📌 Expected next node:", currentNode.data?.nextNodeId || "None");
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
