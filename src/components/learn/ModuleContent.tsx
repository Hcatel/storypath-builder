
import { FlowNode, MessageNodeData, TextInputNodeData, VideoNodeData, RouterNodeData } from "@/types/module";
import { MessageNodeRenderer } from "@/components/nodes/learn/MessageNodeRenderer";
import { TextInputNodeRenderer } from "@/components/nodes/learn/TextInputNodeRenderer";
import { VideoNodeRenderer } from "@/components/nodes/learn/VideoNodeRenderer";
import { RouterNodeRenderer } from "@/components/nodes/learn/RouterNodeRenderer";

interface ModuleContentProps {
  currentNode: FlowNode;
  onRouterChoice?: (choiceIndex: number) => void;
}

export function ModuleContent({ currentNode, onRouterChoice }: ModuleContentProps) {
  const renderNodeContent = (node: FlowNode) => {
    switch (node.type) {
      case "message":
        if ("title" in node.data && "content" in node.data) {
          return <MessageNodeRenderer data={node.data as MessageNodeData} />;
        }
        return <div>Invalid message node data</div>;
      
      case "text_input":
        if ("question" in node.data) {
          return <TextInputNodeRenderer data={node.data as TextInputNodeData} />;
        }
        return <div>Invalid text input node data</div>;
      
      case "video":
        if ("title" in node.data && "videoUrl" in node.data) {
          return <VideoNodeRenderer data={node.data as VideoNodeData} />;
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
