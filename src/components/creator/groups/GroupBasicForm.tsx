
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface GroupBasicFormProps {
  groupId?: string;
  initialData?: {
    name: string;
    description: string;
  };
  isLoading?: boolean;
}

export function GroupBasicForm({ groupId, initialData, isLoading }: GroupBasicFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create or edit groups",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (groupId) {
        // Update existing group
        const { error } = await supabase
          .from("groups")
          .update({
            name: formData.name,
            description: formData.description,
          })
          .eq("id", groupId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Group updated successfully",
        });
      } else {
        // Create new group
        const { data, error } = await supabase
          .from("groups")
          .insert({
            name: formData.name,
            description: formData.description,
            created_by: user.id,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating group:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Group created successfully",
        });

        // Only navigate if we have a valid ID
        if (data?.id) {
          navigate(`/creator/groups/${data.id}`);
        } else {
          throw new Error("No group ID returned from creation");
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${groupId ? 'update' : 'create'} group: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter group name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter group description"
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {groupId ? "Saving..." : "Creating..."}
          </>
        ) : (
          groupId ? "Save Changes" : "Create Group"
        )}
      </Button>
    </form>
  );
}
