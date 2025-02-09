
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
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
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
    if (!nodes || nodes.length === 0) return;
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    console.log("🔍 Full node data:", JSON.stringify(currentNode.data, null, 2));

    // Add current node to history before moving to next
    setNavigationHistory(prev => [...prev, currentNode.id]);

    // Check if nextNodeId exists in the node's data
    const nextNodeId = currentNode.data?.nextNodeId;
    if (!nextNodeId) {
      console.log("⚠️ No next node defined for current node:", currentNode.id);
      setShowCompletion(true);
      return;
    }

    console.log("🔄 Looking for next node with ID:", nextNodeId);
    const nextNode = findNodeById(nextNodeId);
    
    if (!nextNode) {
      console.log("❌ Next node not found with ID:", nextNodeId);
      setShowCompletion(true);
      return;
    }

    console.log("✅ Found next node:", nextNode.id, "of type:", nextNode.type);
    const nextIndex = findNodeIndex(nextNode.id);
    
    if (nextIndex !== -1) {
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        console.log("🎭 Activating overlay router:", nextNode.id);
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
      } else {
        console.log("➡️ Moving to node index:", nextIndex);
        setCurrentNodeIndex(nextIndex);
        setHasInteracted(false);
      }
      // Update progress after state changes
      updateProgress(nextNode.id);
    } else {
      console.log("⚠️ Could not find index for next node:", nextNode.id);
      setShowCompletion(true);
    }
  };

  const handlePrevious = () => {
    if (!nodes || nodes.length === 0 || navigationHistory.length === 0) return;
    
    console.log("📍 Current navigation history:", navigationHistory);
    
    // Remove current node from history and get the previous node
    const updatedHistory = [...navigationHistory];
    updatedHistory.pop(); // Remove current node
    const previousNodeId = updatedHistory[updatedHistory.length - 1]; // Get last node in history
    
    if (previousNodeId) {
      const previousIndex = findNodeIndex(previousNodeId);
      if (previousIndex !== -1) {
        console.log("⬅️ Moving back to node:", previousNodeId);
        setCurrentNodeIndex(previousIndex);
        setNavigationHistory(updatedHistory);
        setHasInteracted(false);
        setOverlayRouter(null); // Clear any active overlay router
      }
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
