
import { FlowNode, FlowEdge } from "@/types/module";

export function useNodeUpdater(
  nodes: FlowNode[],
  edges: FlowEdge[],
  setNodes: (nodes: FlowNode[]) => void,
  setEdges: (edges: FlowEdge[]) => void,
  saveChanges: () => void
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
        
        const nextComponentId = choice.nextComponentId || existingEdge?.target || '';
        
        return {
          ...choice,
          nextComponentId,
        };
      });

      setNodes(nds =>
        nds.map(node => {
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
        })
      );

      const nonRouterEdges = edges.filter(edge => edge.source !== nodeId);
      const newRouterEdges = updatedChoices
        .map((choice: any, index: number) => {
          if (choice.nextComponentId) {
            return {
              id: `e${nodeId}-${choice.nextComponentId}-${index}`,
              source: nodeId,
              target: choice.nextComponentId,
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
      setNodes(nds =>
        nds.map(node => {
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
        })
      );

      const filteredEdges = edges.filter(edge => edge.source !== nodeId);
      if (data.nextComponentId) {
        const newEdge: FlowEdge = {
          id: `e${nodeId}-${data.nextComponentId}`,
          source: nodeId,
          target: data.nextComponentId,
          type: 'default',
          data: {}
        };
        setEdges([...filteredEdges, newEdge]);
      } else {
        setEdges(filteredEdges);
      }
    }

    saveChanges();
  };

  return { onNodeUpdate };
}
