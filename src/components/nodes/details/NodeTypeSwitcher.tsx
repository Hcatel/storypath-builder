
import { Node } from "@xyflow/react";
import { NodeData, ComponentType, MessageNodeData, VideoNodeData, RouterNodeData, TextInputNodeData, MultipleChoiceNodeData, RankingNodeData } from "@/types/module";
import { MessageNodeDetails } from "./MessageNodeDetails";
import { VideoNodeDetails } from "./VideoNodeDetails";
import { RouterNodeDetails } from "./RouterNodeDetails";
import { TextInputNodeDetails } from "./TextInputNodeDetails";
import { MultipleChoiceNodeDetails } from "./MultipleChoiceNodeDetails";
import { RankingNodeDetails } from "./RankingNodeDetails";

interface NodeTypeSwitcherProps {
  nodeType: ComponentType;
  nodeData: NodeData;
  selectedNode: Node<NodeData>;
  updateNodeData: (updates: Partial<NodeData>) => void;
  availableNodes: Node<NodeData>[];
}

export function NodeTypeSwitcher({ 
  nodeType, 
  nodeData, 
  selectedNode, 
  updateNodeData, 
  availableNodes 
}: NodeTypeSwitcherProps) {
  if (!nodeType || !selectedNode) return null;

  switch (nodeType) {
    case 'message':
      return (
        <MessageNodeDetails 
          data={nodeData as MessageNodeData} 
          onUpdate={updateNodeData} 
        />
      );
    case 'video':
      return (
        <VideoNodeDetails 
          data={nodeData as VideoNodeData} 
          onUpdate={updateNodeData} 
        />
      );
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
      return (
        <TextInputNodeDetails 
          data={nodeData as TextInputNodeData} 
          onUpdate={updateNodeData} 
        />
      );
    case 'multiple_choice':
      return (
        <MultipleChoiceNodeDetails 
          data={nodeData as MultipleChoiceNodeData} 
          onUpdate={updateNodeData} 
        />
      );
    case 'ranking':
      return (
        <RankingNodeDetails 
          data={nodeData as RankingNodeData} 
          onUpdate={updateNodeData} 
        />
      );
    default: {
      const _exhaustiveCheck: never = nodeType;
      return null;
    }
  }
}
