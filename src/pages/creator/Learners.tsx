
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupsTable } from "@/components/creator/groups/GroupsTable";
import { LearnersTable } from "@/components/creator/groups/LearnersTable";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { CreateGroupDialog } from "@/components/creator/groups/CreateGroupDialog";

export default function CreatorLearners() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <CreatorSidebar />
        <main className="flex-1">
          <div className="container py-6">
            <h1 className="text-3xl font-bold mb-6">Learners</h1>
            
            <Tabs defaultValue="groups" className="space-y-4">
              <TabsList>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="learners">All Learners</TabsTrigger>
              </TabsList>
              
              <TabsContent value="groups" className="space-y-4">
                <GroupsTable />
              </TabsContent>
              
              <TabsContent value="learners" className="space-y-4">
                <LearnersTable />
              </TabsContent>

              <div className="flex justify-end mt-4">
                <CreateGroupDialog />
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
