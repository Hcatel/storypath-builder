
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNodesState, useEdgesState, ReactFlowProvider } from '@xyflow/react';
import { useState } from "react";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { getInitialNode } from "@/constants/moduleComponents";
import { ModuleFlow } from "@/components/module-builder/ModuleFlow";
import { NodeDetailsPopover } from "@/components/module-builder/NodeDetailsPopover";
import { useNodeSelection } from "@/hooks/useNodeSelection";
import { convertToReactFlowNode } from "@/utils/nodeConverters";
import "@xyflow/react/dist/style.css";

export default function BuildPage() {
  const { id } = useParams();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");
  const isCreateMode = !id || id === 'create';
  const {
    selectedNode,
    setSelectedNode,
    popoverPosition,
    setPopoverPosition,
    onNodeClick,
    onPaneClick,
  } = useNodeSelection();

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (isCreateMode) {
        return {
          nodes: [],
          edges: [],
        };
      }
      
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching module:", error);
        throw error;
      }
      
      const convertedNodes = Array.isArray(data?.nodes) 
        ? data.nodes.map(convertToReactFlowNode)
        : [];

      const convertedEdges = Array.isArray(data?.edges)
        ? data.edges.map((edge: any) => ({
            id: edge.id.toString(),
            source: edge.source.toString(),
            target: edge.target.toString(),
            type: edge.type || 'default',
            data: edge.data || {},
          }))
        : [];

      return {
        ...data,
        nodes: convertedNodes,
        edges: convertedEdges,
      };
    },
    enabled: !isCreateMode,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(
    module?.nodes || [getInitialNode()]
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(
    module?.edges || []
  );

  const { saveChanges, onConnect, addNode } = useModuleFlow(
    id || '',
    nodes,
    edges,
    setNodes,
    edges => setEdges(edges as FlowEdge[])
  );

  const onNodeUpdate = (nodeId: string, data: any) => {
    if (data.type === 'router' && data.choices) {
      // Get existing edges for this router node
      const existingRouterEdges = edges.filter(edge => 
        edge.source === nodeId && edge.sourceHandle?.startsWith('choice-')
      );

      // Update node data with synchronized choices
      const updatedChoices = data.choices.map((choice: any, index: number) => {
        // Find existing edge for this choice index
        const existingEdge = existingRouterEdges.find(edge => 
          edge.sourceHandle === `choice-${index}`
        );
        
        // Use the existing edge target if available and no new target is specified
        const nextComponentId = choice.nextComponentId || existingEdge?.target || '';
        
        return {
          ...choice,
          nextComponentId,
        };
      });

      // Update the node first
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

      // Then update edges
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
      // Handle non-router nodes
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

      // Update edges for non-router nodes
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

  if (isLoading && !isCreateMode) {
    return <div>Loading...</div>;
  }

  const availableNodes = selectedNode ? nodes.filter(node => node.id !== selectedNode.id) : [];

  return (
    <div className="h-[calc(100vh-10rem)]">
      <ReactFlowProvider>
        <ModuleFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          selectedComponentType={selectedComponentType}
          onComponentTypeChange={setSelectedComponentType}
          onAddNode={() => addNode(selectedComponentType)}
          onSave={saveChanges}
        />
        <NodeDetailsPopover
          selectedNode={selectedNode}
          popoverPosition={popoverPosition}
          onNodeUpdate={onNodeUpdate}
          onClose={() => setSelectedNode(null)}
          availableNodes={availableNodes}
          edges={edges}
          onPositionChange={setPopoverPosition}
        />
      </ReactFlowProvider>
    </div>
  );
}
