import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  NodeData, 
  ComponentType,
  MessageNodeData,
  VideoNodeData,
  RouterNodeData,
  TextInputNodeData,
  MultipleChoiceNodeData,
  RankingNodeData
} from "@/types/module";
import { MessageNodeDetails } from "./details/MessageNodeDetails";
import { VideoNodeDetails } from "./details/VideoNodeDetails";
import { RouterNodeDetails } from "./details/RouterNodeDetails";
import { TextInputNodeDetails } from "./details/TextInputNodeDetails";
import { MultipleChoiceNodeDetails } from "./details/MultipleChoiceNodeDetails";
import { RankingNodeDetails } from "./details/RankingNodeDetails";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type NodeDetailsPanelProps = {
  selectedNode: Node<NodeData> | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
  availableNodes: Node<NodeData>[];
  edges: { source: string; target: string; }[];
};

export function NodeDetailsPanel({ selectedNode, onNodeUpdate, availableNodes, edges }: NodeDetailsPanelProps) {
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
      
      switch (currentType) {
        case 'message':
          typedData = { 
            ...selectedNode.data, 
            type: 'message',
            nextNodeId 
          } as MessageNodeData;
          break;
        case 'video':
          typedData = { 
            ...selectedNode.data, 
            type: 'video',
            nextNodeId 
          } as VideoNodeData;
          break;
        case 'router':
          typedData = { ...selectedNode.data, type: 'router' } as RouterNodeData;
          break;
        case 'text_input':
          typedData = { 
            ...selectedNode.data, 
            type: 'text_input',
            nextNodeId 
          } as TextInputNodeData;
          break;
        case 'multiple_choice':
          typedData = { 
            ...selectedNode.data, 
            type: 'multiple_choice',
            nextNodeId 
          } as MultipleChoiceNodeData;
          break;
        case 'ranking':
          typedData = { 
            ...selectedNode.data, 
            type: 'ranking',
            nextNodeId 
          } as RankingNodeData;
          break;
        default:
          console.error("Unknown node type:", selectedNode.data.type);
          return;
      }
      
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

  const renderNodeDetails = () => {
    if (!nodeType || !selectedNode) return null;

    switch (nodeType) {
      case 'message':
        return <MessageNodeDetails data={nodeData as MessageNodeData} onUpdate={updateNodeData} />;
      case 'video':
        return <VideoNodeDetails data={nodeData as VideoNodeData} onUpdate={updateNodeData} />;
      case 'router':
        return (
          <RouterNodeDetails 
            data={{
              ...(nodeData as RouterNodeData),
              id: selectedNode.id,
              moduleId: (nodeData as RouterNodeData).moduleId || ''
            }}
            onUpdate={updateNodeData}
            availableNodes={availableNodes}
          />
        );
      case 'text_input':
        return <TextInputNodeDetails data={nodeData as TextInputNodeData} onUpdate={updateNodeData} />;
      case 'multiple_choice':
        return <MultipleChoiceNodeDetails data={nodeData as MultipleChoiceNodeData} onUpdate={updateNodeData} />;
      case 'ranking':
        return <RankingNodeDetails data={nodeData as RankingNodeData} onUpdate={updateNodeData} />;
      default: {
        const _exhaustiveCheck: never = nodeType;
        return null;
      }
    }
  };

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
        <CardTitle>Edit {nodeType.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderNodeDetails()}
        
        {showNextNodeSelection && (
          <div className="space-y-2">
            <Label>Next Node</Label>
            <Select
              value={nodeData.nextNodeId || "none"}
              onValueChange={handleNextNodeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select next node" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.data.label || `${node.type} ${node.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
