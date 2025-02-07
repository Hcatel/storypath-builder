
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeData, ComponentType } from "@/types/module";
import { MessageNodeDetails } from "./details/MessageNodeDetails";
import { VideoNodeDetails } from "./details/VideoNodeDetails";
import { RouterNodeDetails } from "./details/RouterNodeDetails";
import { TextInputNodeDetails } from "./details/TextInputNodeDetails";
import { MultipleChoiceNodeDetails } from "./details/MultipleChoiceNodeDetails";
import { RankingNodeDetails } from "./details/RankingNodeDetails";
import { LikertScaleNodeDetails } from "./details/LikertScaleNodeDetails";
import { MatchingNodeDetails } from "./details/MatchingNodeDetails";

type NodeDetailsPanelProps = {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
  availableNodes: Node[];
};

export function NodeDetailsPanel({ selectedNode, onNodeUpdate, availableNodes }: NodeDetailsPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [nodeType, setNodeType] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (selectedNode) {
      const data = selectedNode.data as NodeData;
      setNodeData(data);
      setNodeType(data.type);
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
    if (!selectedNode || !nodeData) return;

    const updatedData = {
      ...nodeData,
      ...updates,
      type: nodeType // Explicitly preserve the type
    } as NodeData;

    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  const renderNodeDetails = () => {
    console.log("Rendering details for node type:", nodeType);

    switch (nodeType) {
      case 'message':
        return <MessageNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'video':
        return <VideoNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'router':
        return <RouterNodeDetails data={nodeData} onUpdate={updateNodeData} availableNodes={availableNodes} />;
      case 'text_input':
        return <TextInputNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'multiple_choice':
        return <MultipleChoiceNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'ranking':
        return <RankingNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'likert_scale':
        return <LikertScaleNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      case 'matching':
        return <MatchingNodeDetails data={nodeData} onUpdate={updateNodeData} />;
      default: {
        // This helps TypeScript know that we've handled all possible cases
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
