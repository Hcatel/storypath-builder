
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ModuleFlow } from "@/components/module-builder/ModuleFlow";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ComponentType, FlowNode, FlowEdge } from "@/types/module";
import { useState } from "react";
import { ReactFlowProvider } from '@xyflow/react';

const LearnModule = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType>("message");

  const { data: module, isLoading } = useQuery({
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
        // First convert to unknown, then assert the specific types
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

  // Empty handlers since we're in read-only mode
  const handleNodesChange = () => {};
  const handleEdgesChange = () => {};
  const handleConnect = () => {};
  const handleNodeClick = () => {};
  const handlePaneClick = () => {};
  const handleAddNode = () => {};
  const handleSave = () => {};

  if (isLoading) {
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

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
            <p className="text-gray-600 mb-8">This module may have been removed or you don't have permission to view it.</p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          {module.description && (
            <p className="text-gray-600 max-w-2xl">{module.description}</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <ReactFlowProvider>
            <ModuleFlow 
              nodes={module.nodes} 
              edges={module.edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={handleConnect}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              selectedComponentType={selectedComponentType}
              onComponentTypeChange={setSelectedComponentType}
              onAddNode={handleAddNode}
              onSave={handleSave}
            />
          </ReactFlowProvider>
        </div>
      </main>
    </div>
  );
};

export default LearnModule;
