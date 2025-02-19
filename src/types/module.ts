
import { Edge, Node } from '@xyflow/react';

export type ComponentType = 
  | 'message'
  | 'video'
  | 'router'
  | 'text_input'
  | 'multiple_choice'
  | 'ranking';

export interface BaseNodeData {
  [key: string]: unknown;
  label: string;
  type: ComponentType;
  nextNodeId?: string;
  isRequired?: boolean;
}

export interface MessageNodeData extends BaseNodeData {
  type: 'message';
  title: string;
  content: string;
}

export interface VideoNodeData extends BaseNodeData {
  type: 'video';
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  showPlayPause?: boolean;
  showVolume?: boolean;
  showSeeking?: boolean;
  showSubtitles?: boolean;
}

export interface RouterChoice {
  text: string;
  nextNodeId: string;
}

export interface RouterNodeData extends BaseNodeData {
  type: 'router';
  question: string;
  choices: RouterChoice[];
  moduleId?: string;
  isOverlay?: boolean;
}

export interface TextInputNodeData extends BaseNodeData {
  type: 'text_input';
  question: string;
  isRequired?: boolean;
}

export interface MultipleChoiceNodeData extends BaseNodeData {
  type: 'multiple_choice';
  question: string;
  options: string[];
  allowMultiple: boolean;
  isRequired?: boolean;
}

export interface RankingNodeData extends BaseNodeData {
  type: 'ranking';
  title: string;
  instructions: string;
  options: string[];
  isRequired?: boolean;
}

export type NodeData = 
  | MessageNodeData 
  | VideoNodeData 
  | RouterNodeData 
  | TextInputNodeData 
  | MultipleChoiceNodeData 
  | RankingNodeData;

export interface FlowNode extends Node {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface FlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
}

export interface ModuleVariable {
  id: string;
  module_id: string;
  name: string;
  var_type: "string" | "number" | "boolean" | "array";
  description?: string;
  default_value?: any;
  created_at?: string;
  updated_at?: string;
}
