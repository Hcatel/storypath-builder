
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
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      
      if (error) {
        // Don't throw error for no rows found - this is expected when creating a new group
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data;
    },
    enabled: !!groupId && groupId !== "create", // Only run query if groupId exists and isn't "create"
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .order("joined_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!groupId && groupId !== "create", // Only run query if groupId exists and isn't "create"
  });

  if (groupId && groupId !== "create" && isLoadingGroup) {
    return <div>Loading group details...</div>;
  }

  return (
    <div className="space-y-6">
      <GroupBasicForm 
        groupId={groupId !== "create" ? groupId : undefined}
        initialData={group}
        isLoading={isLoadingGroup}
      />
      
      {groupId && groupId !== "create" && (
        <GroupMembersManager
          groupId={groupId}
          members={members}
          isLoading={isLoadingMembers}
        />
      )}
    </div>
  );
}
