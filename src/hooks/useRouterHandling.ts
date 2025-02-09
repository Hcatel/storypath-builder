
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
    console.log("🔍 Finding next node for current node ID:", currentNodeId);
    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) {
      console.log("❌ Current node not found in nodes array");
      return null;
    }
    
    // First try to find the next node using the nextNodeId from the node data
    if (currentNode.data.nextNodeId) {
      console.log("🔗 Found nextNodeId in node data:", currentNode.data.nextNodeId);
      const nextNode = nodes.find(node => node.id === currentNode.data.nextNodeId);
      if (nextNode) {
        console.log("✅ Successfully found next node:", nextNode.id);
        return nextNode;
      }
      console.log("⚠️ nextNodeId specified but node not found in nodes array");
    } else {
      console.log("ℹ️ No nextNodeId specified in node data");
    }

    return null;
  };

  const findNodeById = (nodeId: string): FlowNode | null => {
    if (!nodes) {
      console.log("❌ No nodes array available");
      return null;
    }
    const foundNode = nodes.find(node => node.id === nodeId);
    console.log(foundNode ? `✅ Found node with ID ${nodeId}` : `❌ No node found with ID ${nodeId}`);
    return foundNode || null;
  };

  const handleRouterChoice = useCallback((choiceIndex: number) => {
    if (!nodes || nodes.length === 0) {
      console.error("❌ No nodes available");
      return;
    }

    console.log("🎯 Handling router choice:", choiceIndex);
    console.log("📍 Current node index:", currentNodeIndex);

    const currentNode = nodes[currentNodeIndex];
    console.log("🔍 Current node:", { id: currentNode.id, type: currentNode.type });

    const overlayRouterNode = nodes.find(node => 
      node.type === 'router' && 
      (node.data as RouterNodeData).isOverlay
    );
    
    const routerNode = overlayRouterNode || (currentNode.type === 'router' ? currentNode : null);
    
    if (!routerNode) {
      console.error("❌ No active router node found");
      return;
    }

    const routerData = routerNode.data as RouterNodeData;
    if (!routerData?.choices || !Array.isArray(routerData.choices)) {
      console.error("❌ No choices available", routerData);
      return;
    }
    
    const selectedChoice = routerData.choices[choiceIndex];
    if (!selectedChoice) {
      console.error("❌ Invalid choice index", choiceIndex);
      return;
    }

    console.log("✅ Selected choice:", selectedChoice);

    // Clear any overlay router first
    setOverlayRouter(null);
    
    // Find the next node ID from the selected choice
    const nextNodeId = selectedChoice.nextNodeId;
    if (!nextNodeId) {
      console.error("❌ Missing nextNodeId for choice", selectedChoice);
      return;
    }

    console.log("🔜 Attempting to navigate to node:", nextNodeId);

    // Find the next node by exact ID match
    const nextNode = findNodeById(nextNodeId);
    if (!nextNode) {
      console.error("❌ Next node not found for id:", nextNodeId);
      return;
    }

    // Find the index of the next node for setting current index
    const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId);
    console.log("✅ Moving to next node:", { id: nextNode.id, type: nextNode.type, index: nextNodeIndex });
    
    // Check if the next node is an overlay router
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Next node is an overlay router");
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to next regular node");
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  const handleNodeComplete = useCallback(() => {
    if (!nodes || nodes.length === 0) {
      console.error("❌ Invalid node state");
      return;
    }

    const currentNode = nodes[currentNodeIndex];
    console.log("🏁 Handling node complete for:", { id: currentNode.id, type: currentNode.type });

    // Find the next node based on the nextNodeId
    const nextNode = findNextNodeByEdge(nodes, currentNode.id);
    if (!nextNode) {
      console.log("⚠️ No next node found for current node:", { id: currentNode.id, type: currentNode.type });
      return;
    }

    // Find the index of the next node for setting current index
    const nextNodeIndex = nodes.findIndex(node => node.id === nextNode.id);
    console.log("✅ Node complete - moving to next node:", { 
      id: nextNode.id, 
      type: nextNode.type, 
      index: nextNodeIndex,
      isOverlay: nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay 
    });

    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Activating overlay router");
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to next regular node");
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice, handleNodeComplete };
}
