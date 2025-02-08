
import { useMediaControl } from "./useMediaControl";
import { FlowNode } from "@/types/module";

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
    
    const currentRouterIndex = currentNodeIndex + 1;
    const nextIndex = currentRouterIndex + 1;
    
    setOverlayRouter(null);
    
    if (nextIndex < nodes.length) {
      const nextNode = nodes[nextIndex];
      
      if (nextNode.type === 'router' && nextNode.data.isOverlay) {
        pauseAllMedia();
        setOverlayRouter(nextNode.data);
        updateProgress(nextNode.id);
      } else {
        setCurrentNodeIndex(nextIndex);
        setHasInteracted(false);
        updateProgress(nextNode.id);
      }
    }
  };

  return { handleRouterChoice };
}
