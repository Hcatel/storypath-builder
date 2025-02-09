
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
    console.log("🔍 Finding next node from current node:", currentNodeId);
    const currentNode = nodes.find(node => node.id === currentNodeId);
    if (!currentNode) {
      console.log("❌ Current node not found:", currentNodeId);
      return null;
    }
    
    if (currentNode.data.nextNodeId) {
      console.log("🔗 Next node specified in data:", currentNode.data.nextNodeId);
      const nextNode = nodes.find(node => node.id === currentNode.data.nextNodeId);
      if (nextNode) {
        console.log("✅ Found next node:", nextNode.id);
        return nextNode;
      }
      console.log("⚠️ Specified next node not found:", currentNode.data.nextNodeId);
    }

    return null;
  };

  const findNodeById = (nodeId: string): FlowNode | null => {
    if (!nodes) {
      console.log("❌ No nodes available");
      return null;
    }
    console.log("🔍 Looking for node:", nodeId);
    const foundNode = nodes.find(node => node.id === nodeId);
    if (foundNode) {
      console.log("✅ Found node:", foundNode.id, "of type:", foundNode.type);
    } else {
      console.log("❌ Node not found:", nodeId);
    }
    return foundNode || null;
  };

  const handleRouterChoice = useCallback((choiceIndex: number) => {
    if (!nodes || nodes.length === 0) {
      console.log("❌ No nodes available for navigation");
      return;
    }

    const currentNode = nodes[currentNodeIndex];
    console.log("📍 Current node:", currentNode.id, "of type:", currentNode.type);

    const overlayRouterNode = nodes.find(node => 
      node.type === 'router' && 
      (node.data as RouterNodeData).isOverlay
    );
    
    const routerNode = overlayRouterNode || (currentNode.type === 'router' ? currentNode : null);
    
    if (!routerNode) {
      console.log("❌ No active router node found");
      return;
    }

    const routerData = routerNode.data as RouterNodeData;
    if (!routerData?.choices || !Array.isArray(routerData.choices)) {
      console.log("❌ No choices available in router node:", routerNode.id);
      return;
    }
    
    const selectedChoice = routerData.choices[choiceIndex];
    if (!selectedChoice) {
      console.log("❌ Invalid choice index for router:", routerNode.id);
      return;
    }

    console.log("✅ Selected choice leads to node:", selectedChoice.nextNodeId);

    setOverlayRouter(null);
    
    const nextNodeId = selectedChoice.nextNodeId;
    if (!nextNodeId) {
      console.log("❌ No next node specified for choice in router:", routerNode.id);
      return;
    }

    console.log("🔜 Navigating to node:", nextNodeId);

    const nextNode = findNodeById(nextNodeId);
    if (!nextNode) {
      console.log("❌ Navigation target node not found:", nextNodeId);
      return;
    }

    const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId);
    console.log("✅ Navigation complete to node:", nextNode.id, "of type:", nextNode.type);
    
    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Activating overlay router:", nextNode.id);
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to node:", nextNode.id);
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  const handleNodeComplete = useCallback(() => {
    if (!nodes || nodes.length === 0) {
      console.log("❌ No nodes available for navigation");
      return;
    }

    const currentNode = nodes[currentNodeIndex];
    console.log("🏁 Current node completed:", currentNode.id, "of type:", currentNode.type);

    const nextNode = findNextNodeByEdge(nodes, currentNode.id);
    if (!nextNode) {
      console.log("⚠️ No next node found from:", currentNode.id);
      return;
    }

    const nextNodeIndex = nodes.findIndex(node => node.id === nextNode.id);
    console.log("✅ Navigation complete to node:", nextNode.id, "of type:", nextNode.type);

    if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
      console.log("🎭 Activating overlay router:", nextNode.id);
      pauseAllMedia();
      setOverlayRouter(nextNode.data as RouterNodeData);
      updateProgress(nextNode.id);
    } else {
      console.log("➡️ Moving to node:", nextNode.id);
      setCurrentNodeIndex(nextNodeIndex);
      setHasInteracted(false);
      updateProgress(nextNode.id);
    }
  }, [nodes, currentNodeIndex, pauseAllMedia, setOverlayRouter, setCurrentNodeIndex, setHasInteracted, updateProgress]);

  return { handleRouterChoice, handleNodeComplete };
}
