import { useMediaControl } from "./useMediaControl";
import { FlowNode, RouterNodeData } from "@/types/module";

export function useRouterHandling(
  nodes: FlowNode[] | undefined,
  currentNodeIndex: number,
  updateProgress: (nodeId: string) => void,
  setOverlayRouter: (router: RouterNodeData | null) => void,
  setCurrentNodeIndex: (index: number) => void,
  setHasInteracted: (interacted: boolean) => void
) {
  const { pauseAllMedia } = useMediaControl();

  const handleRouterChoice = (choiceIndex: number) => {
    if (!nodes) return;
    
    const currentRouterNode = nodes[currentNodeIndex];
    if (!currentRouterNode) return;

    const routerData = currentRouterNode.data as RouterNodeData;
    if (!routerData?.choices || !Array.isArray(routerData.choices)) return;
    
    const selectedChoice = routerData.choices[choiceIndex];
    if (!selectedChoice || !selectedChoice.nextComponentId) return;
    
    // Clear any existing overlay router
    setOverlayRouter(null);
    
    // Find the index of the node that matches the nextComponentId
    const nextNodeIndex = nodes.findIndex(node => node.id === selectedChoice.nextComponentId);
    
    if (nextNodeIndex !== -1) {
      const nextNode = nodes[nextNodeIndex];
      
      // If the next node is an overlay router, set it as overlay
      if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
        pauseAllMedia();
        if ('question' in nextNode.data && 'choices' in nextNode.data) {
          setOverlayRouter(nextNode.data as RouterNodeData);
          updateProgress(nextNode.id);
        }
      } else {
        // Otherwise, navigate to the next node
        setCurrentNodeIndex(nextNodeIndex);
        setHasInteracted(false);
        updateProgress(nextNode.id);
      }
    }
  };

  return { handleRouterChoice };
}
