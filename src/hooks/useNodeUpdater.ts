
import { FlowNode, FlowEdge } from "@/types/module";

export function useNodeUpdater(
  nodes: FlowNode[],
  edges: FlowEdge[],
  setNodes: (nodes: FlowNode[]) => void,
  setEdges: (edges: FlowEdge[]) => void,
  // Remove saveChanges parameter as it's not needed
) {
  const onNodeUpdate = (nodeId: string, data: any) => {
    if (data.type === 'router' && data.choices) {
      const existingRouterEdges = edges.filter(edge => 
        edge.source === nodeId && edge.sourceHandle?.startsWith('choice-')
      );

      const updatedChoices = data.choices.map((choice: any, index: number) => {
        const existingEdge = existingRouterEdges.find(edge => 
          edge.sourceHandle === `choice-${index}`
        );
        
        const nextNodeId = choice.nextNodeId || existingEdge?.target || '';
        
        return {
          ...choice,
          nextNodeId,
        };
      });

      const updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
              choices: updatedChoices,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);

      const nonRouterEdges = edges.filter(edge => edge.source !== nodeId);
      const newRouterEdges = updatedChoices
        .map((choice: any, index: number) => {
          if (choice.nextNodeId) {
            return {
              id: `e${nodeId}-${choice.nextNodeId}-${index}`,
              source: nodeId,
              target: choice.nextNodeId,
              sourceHandle: `choice-${index}`,
              type: 'default',
              data: {}
            } as FlowEdge;
          }
          return null;
        })
        .filter((edge: FlowEdge | null): edge is FlowEdge => edge !== null);

      setEdges([...nonRouterEdges, ...newRouterEdges]);
    } else {
      const updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);

      const filteredEdges = edges.filter(edge => edge.source !== nodeId);
      if (data.nextNodeId) {
        const newEdge: FlowEdge = {
          id: `e${nodeId}-${data.nextNodeId}`,
          source: nodeId,
          target: data.nextNodeId,
          type: 'default',
          data: {}
        };
        setEdges([...filteredEdges, newEdge]);
      } else {
        setEdges(filteredEdges);
      }
    }
  };

  return { onNodeUpdate };
}
