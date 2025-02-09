
import { FlowNode, FlowEdge, RouterNodeData } from "@/types/module";

export function useNodeUpdater(
  nodes: FlowNode[],
  edges: FlowEdge[],
  setNodes: (nodes: FlowNode[]) => void,
  setEdges: (edges: FlowEdge[]) => void,
) {
  const onNodeUpdate = (nodeId: string, data: any) => {
    // Find the current node
    const currentNode = nodes.find(node => node.id === nodeId);
    if (!currentNode) {
      console.error("Node not found:", nodeId);
      return;
    }

    // Special handling for router nodes
    if (data.type === 'router' && data.choices) {
      // Validate router node data
      if (!Array.isArray(data.choices) || data.choices.length < 2) {
        console.error("Router node must have at least two choices");
        return;
      }

      const existingRouterEdges = edges.filter(edge => 
        edge.source === nodeId && edge.sourceHandle?.startsWith('choice-')
      );

      const updatedChoices = data.choices.map((choice: any, index: number) => {
        const existingEdge = existingRouterEdges.find(edge => 
          edge.sourceHandle === `choice-${index}`
        );
        
        return {
          ...choice,
          nextNodeId: choice.nextNodeId || existingEdge?.target || '',
        };
      });

      // Create a new node reference
      const updatedNode = {
        ...currentNode,
        data: {
          ...currentNode.data,
          ...data,
          choices: updatedChoices,
        },
      };

      // Update nodes immutably
      const updatedNodes = nodes.map(node => 
        node.id === nodeId ? updatedNode : node
      );
      
      setNodes(updatedNodes);

      // Handle edge updates
      const nonRouterEdges = edges.filter(edge => edge.source !== nodeId);
      const newRouterEdges = updatedChoices
        .map((choice: any, index: number) => {
          if (!choice.nextNodeId) {
            console.warn(`Choice ${index} has no target node`);
            return null;
          }

          // Validate target node exists
          const targetNode = nodes.find(node => node.id === choice.nextNodeId);
          if (!targetNode) {
            console.error(`Target node ${choice.nextNodeId} not found`);
            return null;
          }

          return {
            id: `e${nodeId}-${choice.nextNodeId}-${index}`,
            source: nodeId,
            target: choice.nextNodeId,
            sourceHandle: `choice-${index}`,
            type: 'default',
            data: {}
          } as FlowEdge;
        })
        .filter((edge): edge is FlowEdge => edge !== null);

      setEdges([...nonRouterEdges, ...newRouterEdges]);
    } else {
      // Handle non-router nodes
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

      // Update edges only if nextNodeId has changed
      if (data.nextNodeId !== currentNode.data.nextNodeId) {
        const filteredEdges = edges.filter(edge => edge.source !== nodeId);
        if (data.nextNodeId) {
          // Validate target node exists
          const targetNode = nodes.find(node => node.id === data.nextNodeId);
          if (!targetNode) {
            console.error(`Target node ${data.nextNodeId} not found`);
            return;
          }

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
    }
  };

  return { onNodeUpdate };
}
