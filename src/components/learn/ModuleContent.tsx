
import { FlowNode, MessageNodeData, TextInputNodeData, VideoNodeData, RouterNodeData, MultipleChoiceNodeData, RankingNodeData } from "@/types/module";
import { MessageNodeRenderer } from "@/components/nodes/learn/MessageNodeRenderer";
import { TextInputNodeRenderer } from "@/components/nodes/learn/TextInputNodeRenderer";
import { VideoNodeRenderer } from "@/components/nodes/learn/VideoNodeRenderer";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";
import { MultipleChoiceNodeRenderer } from "@/components/nodes/learn/MultipleChoiceNodeRenderer";
import { RankingNodeRenderer } from "@/components/nodes/learn/RankingNodeRenderer";

interface ModuleContentProps {
  currentNode: FlowNode;
  onRouterChoice?: (choiceIndex: number) => void;
  onInteraction?: () => void;
  onNodeComplete?: () => void;
}

export function ModuleContent({ currentNode, onRouterChoice, onInteraction, onNodeComplete }: ModuleContentProps) {
  const renderNodeContent = (node: FlowNode) => {
    switch (node.type) {
      case "message":
        if ("title" in node.data && "content" in node.data) {
          return (
            <MessageNodeRenderer 
              data={node.data as MessageNodeData} 
              onComplete={onNodeComplete}
            />
          );
        }
        return <div>Invalid message node data</div>;
      
      case "text_input":
        if ("question" in node.data) {
          return (
            <TextInputNodeRenderer 
              data={node.data as TextInputNodeData} 
              onSubmit={() => {
                onInteraction?.();
                onNodeComplete?.();
              }}
            />
          );
        }
        return <div>Invalid text input node data</div>;
      
      case "video":
        if ("title" in node.data && "videoUrl" in node.data) {
          return (
            <VideoNodeRenderer 
              data={node.data as VideoNodeData}
              onComplete={onNodeComplete}
            />
          );
        }
        return <div>Invalid video node data</div>;

      case "router":
        if ("question" in node.data && "choices" in node.data) {
          return (
            <RouterNodeRenderer 
              data={node.data as RouterNodeData}
              onChoiceSelect={onRouterChoice}
            />
          );
        }
        return <div>Invalid router node data</div>;

      case "multiple_choice":
        if ("question" in node.data && "options" in node.data) {
          return (
            <MultipleChoiceNodeRenderer
              data={node.data as MultipleChoiceNodeData}
              onOptionSelect={(index) => {
                onInteraction?.();
                onNodeComplete?.();
              }}
            />
          );
        }
        return <div>Invalid multiple choice node data</div>;

      case "ranking":
        if ("title" in node.data && "options" in node.data) {
          return (
            <RankingNodeRenderer
              data={node.data as RankingNodeData}
              onRankingChange={(ranking) => {
                onInteraction?.();
                onNodeComplete?.();
              }}
            />
          );
        }
        return <div>Invalid ranking node data</div>;
      
      default:
        return <div>Unsupported node type: {node.type}</div>;
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      {renderNodeContent(currentNode)}
    </div>
  );
}
