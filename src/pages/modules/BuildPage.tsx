
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  NodeTypes,
  Node,
} from "@xyflow/react";
import { useState } from "react";
import { ComponentType, NodeData, FlowNode, FlowEdge } from "@/types/module";
import { ModuleToolbar } from "@/components/module-builder/ModuleToolbar";
import { useModuleFlow } from "@/hooks/useModuleFlow";
import { nodeTypes, getInitialNode } from "@/constants/moduleComponents";
import { NodeDetailsPanel } from "@/components/nodes/NodeDetailsPanel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
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
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number; y: number } | null>(null);
  const isCreateMode = !id || id === 'create';

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      if (!id || isCreateMode) throw new Error("No module ID provided");
      
      console.log("Fetching module with ID:", id);
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
    enabled: !isCreateMode && !!id,
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
    setEdges
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    const bounds = (event.target as HTMLElement).getBoundingClientRect();
    setPopoverAnchor({ x: bounds.right, y: bounds.top });
    setSelectedNode(node as FlowNode);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
    setPopoverAnchor(null);
  };

  const onNodeUpdate = (nodeId: string, data: NodeData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data,
          };
        }
        return node;
      })
    );
  };

  if (isLoading && !isCreateMode) {
    return <div>Loading...</div>;
  }

  const availableNodes = selectedNode ? nodes.filter(node => node.id !== selectedNode.id) : [];

  return (
    <div className="h-[calc(100vh-10rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as NodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left">
          <ModuleToolbar
            selectedComponentType={selectedComponentType}
            onComponentTypeChange={setSelectedComponentType}
            onAddNode={() => addNode(selectedComponentType)}
            onSave={saveChanges}
          />
        </Panel>
      </ReactFlow>
      {selectedNode && popoverAnchor && (
        <div 
          className="fixed"
          style={{ 
            left: popoverAnchor.x, 
            top: popoverAnchor.y,
            zIndex: 1000 
          }}
        >
          <Popover open={selectedNode !== null} onOpenChange={() => setSelectedNode(null)}>
            <PopoverTrigger asChild>
              <div className="w-0 h-0" />
            </PopoverTrigger>
            <PopoverContent side="right" className="p-0">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={100}>
                  <NodeDetailsPanel 
                    selectedNode={selectedNode}
                    onNodeUpdate={onNodeUpdate}
                    availableNodes={availableNodes}
                  />
                </ResizablePanel>
                <ResizableHandle />
              </ResizablePanelGroup>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
