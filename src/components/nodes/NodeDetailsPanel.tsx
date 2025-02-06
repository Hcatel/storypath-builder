
import { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { ComponentType, NodeData } from "@/types/module";

type NodeDetailsPanelProps = {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
};

export function NodeDetailsPanel({ selectedNode, onNodeUpdate }: NodeDetailsPanelProps) {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data);
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
    if (!selectedNode) return;
    
    const updatedData = { ...nodeData, ...updates };
    setNodeData(updatedData);
    onNodeUpdate(selectedNode.id, updatedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {nodeData.type.replace('_', ' ').toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nodeData.type === 'message' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={nodeData.title}
                onChange={(e) => updateNodeData({ title: e.target.value })}
                placeholder="Enter message title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={nodeData.content}
                onChange={(e) => updateNodeData({ content: e.target.value })}
                placeholder="Enter message content"
              />
            </div>
          </>
        )}

        {nodeData.type === 'video' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={nodeData.title}
                onChange={(e) => updateNodeData({ title: e.target.value })}
                placeholder="Enter video title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <Input
                value={nodeData.videoUrl}
                onChange={(e) => updateNodeData({ videoUrl: e.target.value })}
                placeholder="Enter video URL"
              />
            </div>
          </>
        )}

        {nodeData.type === 'router' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input
                value={nodeData.question}
                onChange={(e) => updateNodeData({ question: e.target.value })}
                placeholder="Enter the decision question"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Choices</label>
              {nodeData.choices.map((choice, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={choice.text}
                    onChange={(e) => {
                      const newChoices = [...nodeData.choices];
                      newChoices[index] = { ...choice, text: e.target.value };
                      updateNodeData({ choices: newChoices });
                    }}
                    placeholder={`Choice ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newChoices = nodeData.choices.filter((_, i) => i !== index);
                      updateNodeData({ choices: newChoices });
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newChoices = [...nodeData.choices, { text: '', nextComponentId: '' }];
                  updateNodeData({ choices: newChoices });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Choice
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
