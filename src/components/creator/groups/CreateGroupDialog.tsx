
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateGroupDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emails: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create groups",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name,
          description: formData.description,
          created_by: userData.user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add members if emails are provided
      if (formData.emails.trim()) {
        const emails = formData.emails.split(/[\n,]/).map(email => email.trim()).filter(email => email);
        
        const { error: membersError } = await supabase
          .from("group_members")
          .insert(
            emails.map(email => ({
              group_id: group.id,
              email: email
            }))
          );

        if (membersError) throw membersError;
      }

      toast({
        title: "Success",
        description: "Group created successfully",
      });

      // Reset form and close dialog
      setFormData({ name: "", description: "", emails: "" });
      setIsOpen(false);
      
      // Refresh groups list
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create group: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

          <div className="space-y-2">
            <Label htmlFor="emails">Member Emails</Label>
            <Textarea
              id="emails"
              value={formData.emails}
              onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
              placeholder="Enter email addresses (one per line or comma-separated)"
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
