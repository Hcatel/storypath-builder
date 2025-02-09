
import { Header } from "@/components/Header";
import { GroupDetailsSidebar } from "@/components/creator/groups/GroupDetailsSidebar";
import { GroupDetailsForm } from "@/components/creator/groups/GroupDetailsForm";
import { useParams } from "react-router-dom";

export default function GroupDetails() {
  const { groupId } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <GroupDetailsSidebar groupId={groupId} />
        <main className="flex-1">
          <div className="container py-6">
            <h1 className="text-3xl font-bold mb-6">Group Details</h1>
            <GroupDetailsForm groupId={groupId} />
          </div>
        </main>
      </div>
    </div>
  );
}
