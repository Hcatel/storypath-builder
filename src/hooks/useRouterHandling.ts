
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

    // Find the active router node (either current node or overlay)
    const currentNode = nodes[currentNodeIndex];
    const overlayRouterNode = nodes.find(node => 
      node.type === 'router' && 
      (node.data as RouterNodeData).isOverlay
    );
    
    // Use the overlay router if it exists, otherwise use current node if it's a router
    const routerNode = overlayRouterNode || (currentNode.type === 'router' ? currentNode : null);
    
    if (!routerNode) {
      console.error("No active router node found");
      return;
    }

    const routerData = routerNode.data as RouterNodeData;
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
    
    // Clear any existing overlay router
    setOverlayRouter(null);
    
    // Find the index of the node that matches the nextComponentId
    const nextNodeIndex = nodes.findIndex(node => node.id === selectedChoice.nextComponentId);
    
    if (nextNodeIndex === -1) {
      console.error("Next node not found");
      return;
    }

    const nextNode = nodes[nextNodeIndex];
    
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

  const handleNodeComplete = useCallback(() => {
    if (!nodes || nodes.length === 0 || currentNodeIndex >= nodes.length) {
      console.error("Invalid node state");
      return;
    }

    const currentNode = nodes[currentNodeIndex];
    
    // For non-router nodes, check if there's a next node specified
    if (currentNode.type !== 'router' && currentNode.data.nextComponentId) {
      const nextNodeIndex = nodes.findIndex(node => node.id === currentNode.data.nextComponentId);
      
      if (nextNodeIndex !== -1) {
        const nextNode = nodes[nextNodeIndex];
        
        // Handle overlay routers
        if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
          pauseAllMedia();
          setOverlayRouter(nextNode.data as RouterNodeData);
          updateProgress(nextNode.id);
        } else {
          setCurrentNodeIndex(nextNodeIndex);
          setHasInteracted(false);
          updateProgress(nextNode.id);
        }
      }
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice, handleNodeComplete };
}
