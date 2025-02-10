
import { Header } from "@/components/Header";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { CreateGroupDialog } from "@/components/creator/learners/CreateGroupDialog";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreatorLearners() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1">
          <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Learners</h1>
              <Button onClick={() => setCreateGroupOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>
            <div className="text-muted-foreground">
              Learner management features coming soon...
            </div>
            <CreateGroupDialog
              open={createGroupOpen}
              onOpenChange={setCreateGroupOpen}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
