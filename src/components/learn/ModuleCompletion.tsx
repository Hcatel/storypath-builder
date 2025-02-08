
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share, Trophy, Compass, Play, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModuleShareLink } from "@/components/modules/share/ModuleShareLink";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ModuleCompletionProps {
  moduleId: string;
  playlistModuleId?: string;
  hasNextModule?: boolean;
  onPlayNext?: () => void;
}

export function ModuleCompletion({ 
  moduleId, 
  playlistModuleId,
  hasNextModule,
  onPlayNext 
}: ModuleCompletionProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storeCompletion = async () => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('module_completions')
          .insert({
            module_id: moduleId,
            user_id: user.id,
          });

        if (error) throw error;
      } catch (error: any) {
        console.error('Error storing module completion:', error);
        toast({
          title: "Error",
          description: "Failed to save your progress",
          variant: "destructive",
        });
      }
    };

    storeCompletion();
  }, [moduleId, user, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary-100 to-secondary-100">
      <div className="max-w-lg w-full mx-auto p-8 text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-700">
            You've completed this Module
          </p>
        </div>

        <div className="grid gap-4">
          <Button
            onClick={() => navigate("/profile")}
            variant="outline"
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Summary
          </Button>

          <Button
            onClick={() => navigate("/explore")}
            variant="outline"
            className="w-full"
          >
            <Compass className="w-4 h-4 mr-2" />
            Explore
          </Button>

          {hasNextModule && (
            <Button 
              onClick={onPlayNext}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Next
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ModuleShareLink moduleId={moduleId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
