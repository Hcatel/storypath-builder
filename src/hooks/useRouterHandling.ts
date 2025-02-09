
import { useMediaControl } from "./useMediaControl";
import { FlowNode, RouterNodeData, FlowEdge } from "@/types/module";
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

  const findNextNodeByEdge = (nodes: FlowNode[], currentNodeId: string): FlowNode | null => {
    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) return null;
    
    // First try to find the next node using the nextNodeId from the node data
    if (currentNode.data.nextNodeId) {
      const nextNode = nodes.find(node => node.id === currentNode.data.nextNodeId);
      if (nextNode) {
        console.log("Found next node using nextNodeId:", nextNode);
        return nextNode;
      }
    }

    return null;
  };

  const handleRouterChoice = useCallback((choiceIndex: number) => {
    if (!nodes || nodes.length === 0) {
      console.error("No nodes available");
      return;
    }

    const currentNode = nodes[currentNodeIndex];
    const overlayRouterNode = nodes.find(node => 
      node.type === 'router' && 
      (node.data as RouterNodeData).isOverlay
    );
    
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

    console.log("Selected choice:", selectedChoice);
    console.log("Available nodes:", nodes);

    // Clear any overlay router first
    setOverlayRouter(null);
    
    // Find the next node ID from the selected choice
    const nextNodeId = selectedChoice.nextNodeId;
    if (!nextNodeId) {
      console.error("Missing nextNodeId for choice", selectedChoice);
      return;
    }

    // Find the next node's index in the nodes array
    const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId);
    console.log("Next node index:", nextNodeIndex, "for nextNodeId:", nextNodeId);
    
    if (nextNodeIndex === -1) {
      console.error("Next node not found for id:", nextNodeId);
      return;
    }

    const nextNode = nodes[nextNodeIndex];
    console.log("Moving to next node:", nextNode);
    
    // Check if the next node is an overlay router
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      // Move to the next node and reset interaction state
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
    console.log("Handling node complete for:", currentNode);

    // Find the next node based on the connections
    const nextNode = findNextNodeByEdge(nodes, currentNode.id);
    if (nextNode) {
      const nextNodeIndex = nodes.findIndex(node => node.id === nextNode.id);
      console.log("Node complete - moving to next node index:", nextNodeIndex, "from current node:", currentNode);

      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        pauseAllMedia();
        setOverlayRouter(nextNode.data as RouterNodeData);
        updateProgress(nextNode.id);
      } else {
        setCurrentNodeIndex(nextNodeIndex);
        setHasInteracted(false);
        updateProgress(nextNode.id);
      }
    } else {
      console.log("No next node found for current node:", currentNode);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice, handleNodeComplete };
}
