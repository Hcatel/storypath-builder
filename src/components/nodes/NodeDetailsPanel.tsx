
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeData } from "@/types/module";
import { MessageNodeDetails } from "./details/MessageNodeDetails";
import { VideoNodeDetails } from "./details/VideoNodeDetails";
import { RouterNodeDetails } from "./details/RouterNodeDetails";
import { TextInputNodeDetails } from "./details/TextInputNodeDetails";
import { MultipleChoiceNodeDetails } from "./details/MultipleChoiceNodeDetails";

type NodeDetailsPanelProps = {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
};

export function NodeDetailsPanel({ selectedNode, onNodeUpdate }: NodeDetailsPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data as unknown as NodeData);
    } else {
      setNodeData(null);
    }
  }, [selectedNode]);

  if (!selectedNode || !nodeData) {
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
    if (!selectedNode || !nodeData) return;

    const updatedData = { ...nodeData, ...updates } as NodeData;
    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  const renderNodeDetails = () => {
    switch (nodeData.type) {
      case 'message':
        return <MessageNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'video':
        return <VideoNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'router':
        return <RouterNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'text_input':
        return <TextInputNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'multiple_choice':
        return <MultipleChoiceNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {nodeData.type.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderNodeDetails()}
      </CardContent>
    </Card>
  );
}
