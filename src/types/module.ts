
import { Edge, Node } from '@xyflow/react';

export type ComponentType = 
  | 'message'
  | 'video'
  | 'router'
  | 'text_input'
  | 'multiple_choice'
  | 'ranking'
  | 'likert_scale'
  | 'matching';

export interface BaseNodeData {
  label: string;
  type: ComponentType;
  nextComponentId?: string;
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
}

export interface RouterChoice {
  text: string;
  nextComponentId: string;
}

export interface RouterNodeData extends BaseNodeData {
  type: 'router';
  question: string;
  choices: RouterChoice[];
}

export interface TextInputNodeData extends BaseNodeData {
  type: 'text_input';
  question: string;
}

export interface MultipleChoiceNodeData extends BaseNodeData {
  type: 'multiple_choice';
  question: string;
  options: string[];
  allowMultiple: boolean;
}

export interface RankingNodeData extends BaseNodeData {
  type: 'ranking';
  title: string;
  options: string[];
}

export interface LikertScaleNodeData extends BaseNodeData {
  type: 'likert_scale';
  question: string;
  scaleStart: number;
  scaleEnd: number;
  labels: { [key: number]: string };
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingNodeData extends BaseNodeData {
  type: 'matching';
  title: string;
  pairs: MatchingPair[];
}

export type NodeData = 
  | MessageNodeData 
  | VideoNodeData 
  | RouterNodeData 
  | TextInputNodeData 
  | MultipleChoiceNodeData 
  | RankingNodeData 
  | LikertScaleNodeData 
  | MatchingNodeData;

export interface FlowNode extends Node {
  type: ComponentType;
  data: NodeData;
}

export interface FlowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, unknown>;
}
