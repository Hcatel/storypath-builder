
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NodeData } from "@/types/module";
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

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data as NodeData);
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

    const baseData = { ...nodeData };
    const updatedData = {
      ...baseData,
      ...updates,
    } as NodeData;

    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  const renderNodeDetails = () => {
    if (!nodeData?.type) return null;
    
    console.log("Rendering details for node type:", nodeData.type);
    
    const nodeType = nodeData.type as keyof typeof nodeTypeComponentMap;
    const nodeTypeComponentMap = {
      message: () => <MessageNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      video: () => <VideoNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      router: () => <RouterNodeDetails data={nodeData} onUpdate={updateNodeData} availableNodes={availableNodes} />,
      text_input: () => <TextInputNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      multiple_choice: () => <MultipleChoiceNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      ranking: () => <RankingNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      likert_scale: () => <LikertScaleNodeDetails data={nodeData} onUpdate={updateNodeData} />,
      matching: () => <MatchingNodeDetails data={nodeData} onUpdate={updateNodeData} />,
    };

    return nodeTypeComponentMap[nodeType]?.() || null;
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
