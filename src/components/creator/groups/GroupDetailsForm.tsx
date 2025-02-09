import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface GroupDetailsFormProps {
  groupId?: string;
}

export function GroupDetailsForm({ groupId }: GroupDetailsFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!groupId) return null;
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .order("joined_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const emails = text.split(/[\n,]/).map(email => email.trim()).filter(email => email);
      
      for (const email of emails) {
        await addMember(email);
      }

      toast({
        title: "Success",
        description: `Added ${emails.length} members from file`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process file: " + error.message,
        variant: "destructive",
      });
    }
  };

  const addMember = async (email: string) => {
    if (!groupId) return;
    
    try {
      const { error } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          email: email,
        });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["group-members", groupId] });
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add member: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create or edit groups",
        variant: "destructive",
      });
      return;
    }

    try {
      if (groupId) {
        // Update existing group
        const { error } = await supabase
          .from("groups")
          .update({
            name: formData.name,
            description: formData.description,
            created_by: userData.user.id
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
            created_by: userData.user.id
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Group created successfully",
        });

        navigate(`/creator/groups/${data.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to ${groupId ? 'update' : 'create'} group: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingGroup && groupId) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          {isSubmitting ? (groupId ? "Saving..." : "Creating...") : (groupId ? "Save Changes" : "Create Group")}
        </Button>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Group Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Button onClick={() => addMember(newEmail)} disabled={!newEmail}>
              Add Member
            </Button>
            <div>
              <Input
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import from File
              </Button>
            </div>
          </div>

          {isLoadingMembers ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : members && members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Last Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{format(new Date(member.joined_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(member.joined_at), 'MMM d, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No members added yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
