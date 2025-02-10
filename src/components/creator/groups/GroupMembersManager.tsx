
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { GroupMembersList } from "./GroupMembersList";

interface GroupMembersManagerProps {
  groupId: string;
  members: Array<{
    id: string;
    email: string;
    joined_at: string;
  }> | undefined;
  isLoading: boolean;
}

export function GroupMembersManager({ groupId, members, isLoading }: GroupMembersManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");

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
          email: email
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

  return (
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

        <GroupMembersList members={members} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
