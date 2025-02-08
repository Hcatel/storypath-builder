
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  NodeData, 
  ComponentType,
} from "@/types/module";
import { NodeTypeSwitcher } from "./NodeTypeSwitcher";
import { NodeNextSelector } from "./NodeNextSelector";

type NodeDetailsPanelProps = {
  selectedNode: Node<NodeData> | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
  availableNodes: Node<NodeData>[];
  edges: { source: string; target: string; }[];
};

export function NodeDetailsPanel({ 
  selectedNode, 
  onNodeUpdate, 
  availableNodes, 
  edges 
}: NodeDetailsPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [nodeType, setNodeType] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      if (!selectedNode.data.type) {
        console.error("Node data is missing type:", selectedNode.data);
        return;
      }
      
      const currentType = selectedNode.data.type as ComponentType;
      let typedData: NodeData;
      
      // Find if there's an edge from this node to another node
      const outgoingEdge = edges.find(edge => edge.source === selectedNode.id);
      const nextNodeId = outgoingEdge?.target || undefined;
      
      // Construct typed data based on node type
      typedData = {
        ...selectedNode.data,
        type: currentType,
        nextNodeId: currentType !== 'router' ? nextNodeId : undefined
      };
      
      setNodeData(typedData);
      setNodeType(currentType);
    } else {
      setNodeData(null);
      setNodeType(null);
    }
  }, [selectedNode, edges]);

  const handleNextNodeChange = (nextNodeId: string | null) => {
    if (!selectedNode || !nodeData) return;

    const updatedData = {
      ...nodeData,
      nextNodeId: nextNodeId === "none" ? undefined : nextNodeId
    };

    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  if (!selectedNode || !nodeData || !nodeType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Node Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Select a node to edit its properties</p>
        </CardContent>
      </Card>
    );
  }

  // Don't show next node selection for router nodes since they use choices
  const showNextNodeSelection = nodeType !== 'router';

  const updateNodeData = (updates: Partial<NodeData>) => {
    if (!selectedNode || !nodeData || !nodeType) return;

    const updatedData = {
      ...nodeData,
      ...updates,
      type: nodeType
    } as NodeData;

    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {nodeType?.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <NodeTypeSwitcher
          nodeType={nodeType}
          nodeData={nodeData}
          selectedNode={selectedNode}
          updateNodeData={updateNodeData}
          availableNodes={availableNodes}
        />
        
        {showNextNodeSelection && (
          <NodeNextSelector
            nodeData={nodeData}
            availableNodes={availableNodes}
            onNextNodeChange={handleNextNodeChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
