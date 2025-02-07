
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
    if (!nodeData) return null;
    
    console.log("Rendering details for node type:", nodeData.type);
    
    const type = nodeData.type as keyof typeof nodeTypeComponents;
    const Component = nodeTypeComponents[type];
    
    if (!Component) {
      console.warn("Unknown node type:", type);
      return null;
    }
    
    return <Component data={nodeData} onUpdate={updateNodeData} availableNodes={availableNodes} />;
  };

  const nodeTypeComponents = {
    message: MessageNodeDetails,
    video: VideoNodeDetails,
    router: RouterNodeDetails,
    text_input: TextInputNodeDetails,
    multiple_choice: MultipleChoiceNodeDetails,
    ranking: RankingNodeDetails,
    likert_scale: LikertScaleNodeDetails,
    matching: MatchingNodeDetails,
  } as const;

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

