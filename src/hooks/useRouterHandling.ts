
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
    
    if (currentNode.data.nextNodeId) {
      const nextNode = nodes.find(node => node.id === currentNode.data.nextNodeId);
      if (nextNode) return nextNode;
    }

    return null;
  };

  const findNodeById = (nodeId: string): FlowNode | null => {
    if (!nodes) return null;
    return nodes.find(node => node.id === nodeId) || null;
  };

  const handleRouterChoice = useCallback((choiceIndex: number) => {
    if (!nodes || nodes.length === 0) return;

    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);

    const overlayRouterNode = nodes.find(node => 
      node.type === 'router' && 
      (node.data as RouterNodeData).isOverlay
    );
    
    const routerNode = overlayRouterNode || (currentNode.type === 'router' ? currentNode : null);
    if (!routerNode) return;

    const routerData = routerNode.data as RouterNodeData;
    if (!routerData?.choices || !Array.isArray(routerData.choices)) return;
    
    const selectedChoice = routerData.choices[choiceIndex];
    if (!selectedChoice) return;

    console.log("✅ Selected choice leads to node:", selectedChoice.nextNodeId);

    setOverlayRouter(null);
    
    const nextNodeId = selectedChoice.nextNodeId;
    if (!nextNodeId) return;

    console.log("🔜 Navigating to node:", nextNodeId);

    const nextNode = findNodeById(nextNodeId);
    if (!nextNode) return;

    const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId);
    
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Activating overlay router:", nextNode.id);
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to node:", nextNode.id, "of type:", nextNode.type);
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  const handleNodeComplete = useCallback(() => {
    if (!nodes || nodes.length === 0) return;

    const currentNode = nodes[currentNodeIndex];
    console.log("🏁 Current node completed:", currentNode.id, "of type:", currentNode.type);

    const nextNode = findNextNodeByEdge(nodes, currentNode.id);
    if (!nextNode) return;

    const nextNodeIndex = nodes.findIndex(node => node.id === nextNode.id);
    
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Activating overlay router:", nextNode.id);
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to node:", nextNode.id, "of type:", nextNode.type);
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice, handleNodeComplete };
}
