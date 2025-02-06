
import { ComponentType } from "@/types/module";
import { MessageNode } from "@/components/nodes/MessageNode";
import { VideoNode } from "@/components/nodes/VideoNode";
import { RouterNode } from "@/components/nodes/RouterNode";
import { TextInputNode } from "@/components/nodes/TextInputNode";
import { FlowNode } from "@/types/module";

export const componentOptions: { value: ComponentType; label: string }[] = [
  { value: "message", label: "Message" },
  { value: "video", label: "Video" },
  { value: "router", label: "Decision Router" },
  { value: "text_input", label: "Text Input" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "ranking", label: "Ranking" },
  { value: "likert_scale", label: "Likert Scale" },
  { value: "matching", label: "Matching" },
];

export const getInitialNode = (): FlowNode => ({
  id: '1',
  type: "message",
  position: { x: 250, y: 100 },
  data: { 
    type: "message" as const,
    label: "Start Here",
    title: "Welcome",
    content: "Start your module here" 
  },
});

export const nodeTypes = {
  message: MessageNode,
  video: VideoNode,
  router: RouterNode,
  text_input: TextInputNode,
};
