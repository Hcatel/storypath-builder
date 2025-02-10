
import { Header } from "@/components/Header";
import { GroupDetailsSidebar } from "@/components/creator/groups/GroupDetailsSidebar";
import { GroupDetailsForm } from "@/components/creator/groups/GroupDetailsForm";
import { CreateGroupForm } from "@/components/creator/groups/CreateGroupForm";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = id === "create";
  
  useEffect(() => {
    // Redirect if id is undefined or invalid
    if (id && !isCreateMode && id === "undefined") {
      console.log("Invalid group ID detected, redirecting to groups list");
      navigate("/creator/learners?tab=groups");
    }
  }, [id, isCreateMode, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <div className="w-64 border-r bg-card min-h-screen p-4 space-y-8">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/creator/learners?tab=groups" className="hover:text-foreground">
              Groups
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">
              {isCreateMode ? "Create Group" : "Group Details"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-10 h-10 rounded-full bg-primary/20" />
              <div>
                <h3 className="font-semibold">
                  {isCreateMode ? "New Group" : "Group Details"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isCreateMode ? "Create your group" : "Manage your group"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">
              {isCreateMode ? "Create New Group" : "Group Details"}
            </h1>
            {isCreateMode ? (
              <CreateGroupForm />
            ) : (
              <GroupDetailsForm groupId={id} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
