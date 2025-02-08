
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
    const routerData = currentRouterNode.data as RouterNodeData;
    const selectedChoice = routerData.choices[choiceIndex];
    
    // Clear any existing overlay router
    setOverlayRouter(null);
    
    if (selectedChoice && selectedChoice.nextComponentId) {
      // Find the index of the node that matches the nextComponentId
      const nextNodeIndex = nodes.findIndex(node => node.id === selectedChoice.nextComponentId);
      
      if (nextNodeIndex !== -1) {
        const nextNode = nodes[nextNodeIndex];
        
        if (nextNode.type === 'router' && (nextNode.data as RouterNodeData).isOverlay) {
          pauseAllMedia();
          // Ensure the data is of type RouterNodeData before setting it
          if ('question' in nextNode.data && 'choices' in nextNode.data) {
            setOverlayRouter(nextNode.data as RouterNodeData);
            updateProgress(nextNode.id);
          }
        } else {
          setCurrentNodeIndex(nextNodeIndex);
          setHasInteracted(false);
          updateProgress(nextNode.id);
        }
      }
    }
  };

  return { handleRouterChoice };
}
