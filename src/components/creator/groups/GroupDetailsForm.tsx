
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GroupBasicForm } from "./GroupBasicForm";
import { GroupMembersManager } from "./GroupMembersManager";

interface GroupDetailsFormProps {
  groupId?: string;
}

export function GroupDetailsForm({ groupId }: GroupDetailsFormProps) {
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

  return (
    <div className="space-y-6">
      <GroupBasicForm 
        groupId={groupId}
        initialData={group}
        isLoading={isLoadingGroup}
      />
      
      {groupId && (
        <GroupMembersManager
          groupId={groupId}
          members={members}
          isLoading={isLoadingMembers}
        />
      )}
    </div>
  );
}
