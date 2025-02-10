
import { Header } from "@/components/Header";
import { GroupDetailsSidebar } from "@/components/creator/groups/GroupDetailsSidebar";
import { GroupDetailsForm } from "@/components/creator/groups/GroupDetailsForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function GroupDetails() {
  const { id } = useParams();
  const isCreateMode = id === "create";
  
  useEffect(() => {
    console.log(`Loading GroupDetails page with id: ${id}, isCreateMode: ${isCreateMode}`);
  }, [id, isCreateMode]);

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

