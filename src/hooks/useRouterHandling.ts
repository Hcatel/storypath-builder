
import { useMediaControl } from "./useMediaControl";
import { FlowNode, RouterNodeData } from "@/types/module";
import { useCallback } from "react";

export function useRouterHandling(
  nodes: FlowNode[] | undefined,
  currentNodeIndex: number,
  updateProgress: (nodeId: string) => void,
  setOverlayRouter: (router: RouterNodeData | null) => void,
  setCurrentNodeIndex: (index: number) => void,
  setHasInteracted: (interacted: boolean) => void
) {
  const { pauseAllMedia } = useMediaControl();

  const handleRouterChoice = useCallback((choiceIndex: number) => {
    if (!nodes || nodes.length === 0) {
      console.error("No nodes available");
      return;
    }
    
    console.log("Current node index:", currentNodeIndex);
    console.log("All nodes:", nodes);
    
    const currentNode = nodes[currentNodeIndex];
    console.log("Current node:", currentNode);
    
    if (!currentNode) {
      console.error("Current node not found");
      return;
    }

    // Extract router data regardless of node type
    const routerData = currentNode.data as RouterNodeData;
    if (!routerData?.choices || !Array.isArray(routerData.choices)) {
      console.error("No choices available", routerData);
      return;
    }
    
    const selectedChoice = routerData.choices[choiceIndex];
    if (!selectedChoice) {
      console.error("Invalid choice index", choiceIndex);
      return;
    }

    if (!selectedChoice.nextComponentId) {
      console.error("Missing nextComponentId for choice", selectedChoice);
      return;
    }
    
    console.log("Selected choice:", selectedChoice);
    console.log("Looking for node with ID:", selectedChoice.nextComponentId);
    
    // Clear any existing overlay router
    setOverlayRouter(null);
    
    // Find the index of the node that matches the nextComponentId
    const nextNodeIndex = nodes.findIndex(node => node.id === selectedChoice.nextComponentId);
    console.log("Next node index:", nextNodeIndex);
    
    if (nextNodeIndex === -1) {
      console.error("Next node not found");
      return;
    }

    const nextNode = nodes[nextNodeIndex];
    console.log("Next node:", nextNode);
    
    // If the next node is an overlay router, set it as overlay
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      // Otherwise, navigate to the next node
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice };
}
