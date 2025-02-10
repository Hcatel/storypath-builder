
import { Header } from "@/components/Header";
import { GroupDetailsSidebar } from "@/components/creator/groups/GroupDetailsSidebar";
import { GroupDetailsForm } from "@/components/creator/groups/GroupDetailsForm";
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function GroupDetails() {
  const { id } = useParams();
  const location = useLocation();
  const isCreateMode = location.pathname === '/creator/groups/create';
  
  useEffect(() => {
    console.log(`Loading GroupDetails page with id: ${isCreateMode ? 'create' : id}, isCreateMode: ${isCreateMode}`);
  }, [id, isCreateMode]);

  // If we're not in create mode and there's no id, return null
  if (!isCreateMode && !id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <GroupDetailsSidebar groupId={isCreateMode ? undefined : id} />
        <main className="flex-1">
          <div className="container py-6">
            <h1 className="text-3xl font-bold mb-6">
              {isCreateMode ? "Create Group" : "Group Details"}
            </h1>
            <GroupDetailsForm 
              groupId={isCreateMode ? undefined : id} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}
