import { useState, useCallback } from "react";
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

  const findNodeById = useCallback((nodeId: string): FlowNode | null => {
    if (!nodes) return null;
    return nodes.find(node => node.id === nodeId) || null;
  }, [nodes]);

  const findNodeIndex = useCallback((nodeId: string): number => {
    if (!nodes) return -1;
    return nodes.findIndex(node => node.id === nodeId);
  }, [nodes]);

  const handleNext = useCallback(() => {
    if (!nodes || nodes.length === 0) return;
    
    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);
    console.log("🔍 Full node data:", JSON.stringify(currentNode.data, null, 2));

    setNavigationHistory(prev => [...prev, currentNode.id]);

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
        // Add router to navigation history even though it's an overlay
        setNavigationHistory(prev => [...prev, nextNode.id]);
      } else {
        console.log("➡️ Moving to node index:", nextIndex);
        setCurrentNodeIndex(nextIndex);
        setHasInteracted(false);
      }
      updateProgress(nextNode.id);
    } else {
      console.log("⚠️ Could not find index for next node:", nextNode.id);
      setShowCompletion(true);
    }
  }, [nodes, currentNodeIndex, findNodeById, findNodeIndex, pauseAllMedia, updateProgress]);

  const handlePrevious = useCallback(() => {
    if (!nodes || nodes.length === 0 || navigationHistory.length <= 1) return;
    
    console.log("📍 Current navigation history:", navigationHistory);
    
    // Pop current node
    const updatedHistory = [...navigationHistory];
    updatedHistory.pop();
    
    // Keep popping if the previous node was an overlay router
    let previousNodeId = updatedHistory[updatedHistory.length - 1];
    let previousNode = findNodeById(previousNodeId);
    
    while (
      previousNode && 
      previousNode.type === 'router' && 
      (previousNode.data as RouterNodeData).isOverlay && 
      updatedHistory.length > 1
    ) {
      updatedHistory.pop();
      previousNodeId = updatedHistory[updatedHistory.length - 1];
      previousNode = findNodeById(previousNodeId);
    }
    
    if (previousNodeId) {
      const previousIndex = findNodeIndex(previousNodeId);
      if (previousIndex !== -1) {
        console.log("⬅️ Moving back to node:", previousNodeId);
        setCurrentNodeIndex(previousIndex);
        setNavigationHistory(updatedHistory);
        setHasInteracted(false);
        setOverlayRouter(null);
      }
    }
  }, [nodes, navigationHistory, findNodeById, findNodeIndex]);

  const handleInteraction = useCallback(() => {
    if (!nodes) return;
    const currentNode = nodes[currentNodeIndex];
    console.log("👆 User interacted with node:", currentNode.id, "of type:", currentNode.type);
    console.log("📌 Expected next node:", currentNode.data?.nextNodeId || "None");
    setHasInteracted(true);
  }, [nodes, currentNodeIndex]);

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
