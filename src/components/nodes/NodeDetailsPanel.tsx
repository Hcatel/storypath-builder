
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

type NodeDetailsPanelProps = {
  selectedNode: Node<NodeData> | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
  availableNodes: Node<NodeData>[];
};

export function NodeDetailsPanel({ selectedNode, onNodeUpdate, availableNodes }: NodeDetailsPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [nodeType, setNodeType] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      // Explicitly check if data.type exists and is a valid ComponentType
      if (!selectedNode.data.type) {
        console.error("Node data is missing type:", selectedNode.data);
        return;
      }
      
      const currentType = selectedNode.data.type as ComponentType;
      let typedData: NodeData;
      
      switch (currentType) {
        case 'message':
          typedData = { ...selectedNode.data, type: 'message' } as MessageNodeData;
          break;
        case 'video':
          typedData = { ...selectedNode.data, type: 'video' } as VideoNodeData;
          break;
        case 'router':
          typedData = { ...selectedNode.data, type: 'router' } as RouterNodeData;
          break;
        case 'text_input':
          typedData = { ...selectedNode.data, type: 'text_input' } as TextInputNodeData;
          break;
        case 'multiple_choice':
          typedData = { ...selectedNode.data, type: 'multiple_choice' } as MultipleChoiceNodeData;
          break;
        case 'ranking':
          typedData = { ...selectedNode.data, type: 'ranking' } as RankingNodeData;
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
  }, [selectedNode]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {nodeType.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderNodeDetails()}
      </CardContent>
    </Card>
  );
}
