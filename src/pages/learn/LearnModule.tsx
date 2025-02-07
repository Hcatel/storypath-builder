import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { useState, useEffect } from "react";
import { MessageNodeRenderer } from "@/components/nodes/learn/MessageNodeRenderer";
import { TextInputNodeRenderer } from "@/components/nodes/learn/TextInputNodeRenderer";
import { VideoNodeRenderer } from "@/components/nodes/learn/VideoNodeRenderer";
import { ModuleNavigation } from "@/components/learn/ModuleNavigation";

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  // Fetch module data
  const { data: module, isLoading: isModuleLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load module",
          variant: "destructive",
        });
        throw error;
      }

      if (data) {
        const nodes = (data.nodes as unknown) as FlowNode[];
        const edges = (data.edges as unknown) as FlowEdge[];

        return {
          ...data,
          nodes,
          edges,
        };
      }

      return null;
    },
  });

  // Fetch learner progress
  const { data: progress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["learner-progress", id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("learner_progress")
        .select("*")
        .eq("module_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      return data;
    },
    enabled: !!user && !!id,
  });

  // Update progress mutation
  const { mutate: updateProgress } = useMutation({
    mutationFn: async (nodeId: string) => {
      if (!user || !id) return;

      const completedNodes = progress?.completed_nodes || [];
      if (!completedNodes.includes(nodeId)) {
        completedNodes.push(nodeId);
      }

      const { error } = await supabase
        .from("learner_progress")
        .upsert({
          user_id: user.id,
          module_id: id,
          current_node_id: nodeId,
          completed_nodes: completedNodes,
        })
        .select()
        .single();

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-progress", id] });
    },
  });

  // Initialize progress if none exists
  useEffect(() => {
    if (
      !isProgressLoading &&
      !progress &&
      user &&
      module?.nodes.length > 0
    ) {
      updateProgress(module.nodes[0].id);
    }
  }, [isProgressLoading, progress, user, module]);

  const handleNext = () => {
    if (!module?.nodes) return;

    const nextIndex = currentNodeIndex + 1;
    if (nextIndex < module.nodes.length) {
      setCurrentNodeIndex(nextIndex);
      updateProgress(module.nodes[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0) {
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  };

  const renderNodeContent = (node: FlowNode) => {
    switch (node.type) {
      case "message":
        return <MessageNodeRenderer data={node.data} />;
      case "text_input":
        return <TextInputNodeRenderer data={node.data} />;
      case "video":
        return <VideoNodeRenderer data={node.data} />;
      default:
        return <div>Unsupported node type: {node.type}</div>;
    }
  };

  if (isModuleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-2xl mb-8" />
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    );
  }

  if (!module || !module.nodes || module.nodes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
            <p className="text-gray-600 mb-8">
              This module may have been removed or you don't have permission to view it.
            </p>
            <Link to="/">
              <Button>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentNode = module.nodes[currentNodeIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          {renderNodeContent(currentNode)}
        </div>

        <ModuleNavigation
          currentIndex={currentNodeIndex}
          totalNodes={module.nodes.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </main>
    </div>
  );
};

export default LearnModule;
