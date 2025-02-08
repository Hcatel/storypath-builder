
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNodesState, useEdgesState, Node, ReactFlowProvider } from '@xyflow/react';
import { useState } from "react";
import { ComponentType, NodeData, FlowNode, FlowEdge } from "@/types/module";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { getInitialNode } from "@/constants/moduleComponents";
import { ModuleFlow } from "@/components/module-builder/ModuleFlow";
import { NodeDetailsPopover } from "@/components/module-builder/NodeDetailsPopover";
import "@xyflow/react/dist/style.css";

const convertToReactFlowNode = (node: any): FlowNode => ({
  id: node.id.toString(),
  type: node.data.type || "message",
  position: node.position || { x: 0, y: 0 },
  data: node.data as NodeData,
});

export default function BuildPage() {
  const { id } = useParams();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);
  const isCreateMode = !id || id === 'create';

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

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if ((window as any).isPopoverDragging) return;
    
    event.stopPropagation();
    const bounds = (event.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({ x: bounds.right + 10, y: bounds.top });
    setSelectedNode(node as unknown as FlowNode);
  };

  const onPaneClick = () => {
    if ((window as any).isPopoverDragging) return;
    
    setSelectedNode(null);
    setPopoverPosition(null);
  };

  const onNodeUpdate = (nodeId: string, data: NodeData) => {
    // Update the node data
    setNodes((nds) =>
      nds.map((node) => {
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

    // Handle edge updates differently for router nodes
    if (data.type === 'router' && data.choices) {
      setEdges((eds) => {
        // Remove existing edges from this node
        const otherEdges = eds.filter(edge => edge.source !== nodeId);
        
        // Create edges for each choice that has a nextComponentId
        const routerEdges = data.choices
          .map((choice, index) => {
            if (choice.nextComponentId) {
              return {
                id: `e${nodeId}-${choice.nextComponentId}-${index}`,
                source: nodeId,
                target: choice.nextComponentId,
                sourceHandle: `choice-${index}`,
                type: 'default'
              };
            }
            return null;
          })
          .filter((edge): edge is FlowEdge => edge !== null);

        return [...otherEdges, ...routerEdges];
      });
    } else if (data.type !== 'router') {
      // Handle regular nodes as before
      setEdges((eds) => {
        const filteredEdges = eds.filter(edge => edge.source !== nodeId);
        
        if (data.nextComponentId) {
          return [...filteredEdges, {
            id: `e${nodeId}-${data.nextComponentId}`,
            source: nodeId,
            target: data.nextComponentId,
            type: 'default'
          }];
        }
        
        return filteredEdges;
      });
    }

    // Automatically save changes
    saveChanges();
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setPopoverPosition(position);
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
          onPositionChange={handlePositionChange}
        />
      </ReactFlowProvider>
    </div>
  );
}
